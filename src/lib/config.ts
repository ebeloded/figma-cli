import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".config", "figma-cli");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

interface Config {
  token?: string;
}

async function readConfig(): Promise<Config> {
  const file = Bun.file(CONFIG_PATH);
  if (!(await file.exists())) {
    return {};
  }
  return (await file.json()) as Config;
}

async function writeConfig(config: Config): Promise<void> {
  await Bun.$`mkdir -p ${CONFIG_DIR}`.quiet();
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");
}

export async function getToken(): Promise<string | undefined> {
  const config = await readConfig();
  return config.token;
}

export async function setToken(token: string): Promise<void> {
  const config = await readConfig();
  config.token = token;
  await writeConfig(config);
}

export async function clearToken(): Promise<void> {
  const config = await readConfig();
  delete config.token;
  await writeConfig(config);
}
