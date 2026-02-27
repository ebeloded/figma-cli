import { defineCommand } from "citty";
import { figmaFetch, FigmaApiError } from "../lib/api-client.ts";
import { isPretty, printJSON, printTable, printError } from "../lib/output.ts";

interface ProjectEntry {
  id: number;
  name: string;
}

interface ProjectsResponse {
  projects: ProjectEntry[];
}

interface FileEntry {
  key: string;
  name: string;
  last_modified: string;
}

interface ProjectFilesResponse {
  files: FileEntry[];
}

export default defineCommand({
  meta: {
    name: "projects",
    description: "List team projects and their files",
  },
  args: {
    "team-id": { type: "positional", description: "Figma team ID" },
    flat: {
      type: "boolean",
      description: "Flatten to a list of files with project name",
      default: false,
    },
  },
  async run({ args }) {
    const teamId = args["team-id"];
    if (!teamId) {
      printError(
        "Team ID is required. Find it in Figma URLs: figma.com/files/team/<team-id>/..."
      );
      process.exit(1);
    }

    try {
      const projectsData = await figmaFetch<ProjectsResponse>(
        `/v1/teams/${teamId}/projects`
      );

      const projectsWithFiles = await Promise.all(
        projectsData.projects.map(async (project) => {
          const filesData = await figmaFetch<ProjectFilesResponse>(
            `/v1/projects/${project.id}/files`
          );
          return {
            id: String(project.id),
            name: project.name,
            files: filesData.files.map((f) => ({
              key: f.key,
              name: f.name,
              lastModified: f.last_modified,
            })),
          };
        })
      );

      if (args.flat) {
        const flatFiles = projectsWithFiles.flatMap((project) =>
          project.files.map((f) => ({
            key: f.key,
            name: f.name,
            project: project.name,
            lastModified: f.lastModified,
          }))
        );

        if (isPretty()) {
          printTable(
            ["Key", "Name", "Project", "Last Modified"],
            flatFiles.map((f) => [
              f.key,
              f.name,
              f.project,
              f.lastModified.replace("T", " ").replace(/:\d{2}(\.\d+)?Z$/, ""),
            ])
          );
        } else {
          printJSON(flatFiles);
        }
      } else {
        if (isPretty()) {
          printTable(
            ["Project", "Files"],
            projectsWithFiles.map((p) => [p.name, String(p.files.length)])
          );
        } else {
          printJSON(projectsWithFiles);
        }
      }
    } catch (err) {
      if (err instanceof FigmaApiError && (err.statusCode === 403 || err.statusCode === 404)) {
        printError(
          `Could not access team ${teamId}. Check the team ID is correct. ` +
            "Find it in Figma URLs: figma.com/files/team/<team-id>/..."
        );
      } else {
        printError(
          err instanceof FigmaApiError
            ? err.message
            : `Unexpected error: ${err}`
        );
      }
      process.exit(1);
    }
  },
});
