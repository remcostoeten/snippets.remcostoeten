export type TCopyLLMConfig = {
  globalEnabled: boolean;
  enabledPaths: string[];
  disabledPaths: string[];
  filenameSuffix: string;
};

const config: TCopyLLMConfig = {
  globalEnabled: true,
  enabledPaths: [],
  disabledPaths: [],
  filenameSuffix: "-llm",
};

export function getCopyLLMConfig(): TCopyLLMConfig {
  return config;
}

export function shouldShowCopyLLM(path: string): boolean {
  const cfg = getCopyLLMConfig();
  if (!cfg.globalEnabled && cfg.enabledPaths.length === 0) return false;
  if (cfg.disabledPaths.some((p) => path.startsWith(p))) return false;
  if (cfg.enabledPaths.length > 0) return cfg.enabledPaths.some((p) => path.startsWith(p));
  return true;
}

export function buildDownloadFilename(title: string, override?: string): string {
  if (override && override.trim().length > 0) return override;
  const base = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${base}${config.filenameSuffix}.txt`;
}
