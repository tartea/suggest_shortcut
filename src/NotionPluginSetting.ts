interface NotionPluginSetting {
  shortcutKeys: SettingConfig[];
  customCommands: SettingConfig[]
}
enum CommandType {
  HTML,
  SHORTCUT
}

interface SettingConfig {
  uuid: string
  title: string,
  search: string,
  command: string,
  type: CommandType
}


const DEFAULT_SETTING: NotionPluginSetting = {
  shortcutKeys: [],
  customCommands: []
}
export { DEFAULT_SETTING,CommandType };
export type { NotionPluginSetting, SettingConfig };
