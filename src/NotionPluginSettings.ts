interface NotionPluginSettings {
  shortcutKeys: SettingConfig[];
}

interface SettingConfig {
  uuid: string
  title: string,
  search: string,
  command: string,
  insertCode: string
}
const DEFAULT_SETTINGS: NotionPluginSettings = {
  shortcutKeys: []
}
export { DEFAULT_SETTINGS };
export type { NotionPluginSettings, SettingConfig };
