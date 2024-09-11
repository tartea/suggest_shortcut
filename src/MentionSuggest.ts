import NotionPlugin from 'main';
import { App, Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, TFile, Plugin } from 'obsidian';
import { CommandType, NotionPluginSetting, SettingConfig } from './NotionPluginSetting';

export default class MentionSuggest extends EditorSuggest<SettingConfig> {

  customSuggestions: SettingConfig[];
  editor: Editor | undefined
  editorSuggest: EditorSuggestTriggerInfo | undefined


  constructor(app: App, pluginSetting: NotionPluginSetting) {
    super(app);
    this.updateSuggestions(pluginSetting)
    // 设置建议项的限制
    this.limit = 20;

    removeEventListener("Loading-NewCommand", () => {
      console.log('remove command')
    });
  }

  // 更新项的方法
  updateSuggestions(pluginSetting: NotionPluginSetting) {
    this.customSuggestions = [...pluginSetting.shortcutKeys, ...pluginSetting.customCommands];
  }

  /**
   * 根据光标位置和当前编辑器状态判断是否触发建议。
   * @param cursor 光标位置
   * @param editor 当前编辑器实例
   * @param file 当前文件
   * @returns 如果触发建议，返回相关信息，否则返回 null
   */
  onTrigger(cursor: EditorPosition, editor: Editor, file: TFile | null): EditorSuggestTriggerInfo | null {

    // 判断第一个元素是不是 / 符号
    const line = editor.getLine(cursor.line);
    const charBeforeCursor = line[0];
    this.editor = editor
    // 检查光标前一字符是否为 '@'
    if (charBeforeCursor === '/' || charBeforeCursor === '、') {
      // 返回触发信息，包含光标位置和查询内容
      this.editorSuggest = {
        start: { line: cursor.line, ch: 0 },
        end: cursor,
        query: line.substring(1, cursor.ch)
      }
      return this.editorSuggest
    }
    return null; // 不触发建议
  }

  /**
   * 根据上下文生成建议项。
   * @param context 上下文信息
   * @returns 返回建议项的数组
   */
  getSuggestions(context: EditorSuggestContext): SettingConfig[] | Promise<SettingConfig[]> {
    const { query } = context;

    const filteredSuggestions = this.customSuggestions.filter(item =>
      item.search.toLowerCase().includes(query.toLowerCase())
    );
    return filteredSuggestions;
  }

  renderSuggestion(value: SettingConfig, el: HTMLElement): void {
    const div = el.createDiv()
    div.addClass("notion_suggest_row")
    const titleEl = div.createDiv()
    titleEl.createEl("b", { text: value.title });
    const searchEl = div.createDiv()
    searchEl.createEl("b", { text: value.search });
    searchEl.addClass('notion_search_el')
    el.createEl("br");
  }
  selectSuggestion(value: SettingConfig, event: MouseEvent | KeyboardEvent): void {
    if (this.editor && this.editorSuggest) {
      const start = this.editorSuggest.start;

      if (CommandType.HTML === value.type) {
        const multilineText = value.command

        // 计算新的光标位置
        this.editor.replaceRange(multilineText.replace(/\$1/g, ''), start, this.editorSuggest.end)

        // 计算新的光标位置
        const lines = multilineText.split('\n');
        let newLine = start.line; // 新行位置
        let newCh = 0; // 新列位置
        let found = false;

        // 查找 '$1' 的位置
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('$1')) {
            newLine = this.editorSuggest.start.line + i; // 更新新行位置
            newCh = lines[i].indexOf('$1'); // 找到 '$1' 的列位置
            found = true;
            break;
          }
        }
        // 如果找到了 '$1'，将光标移动到 '$1' 位置
        if (found) {
          this.editor.setCursor({ line: newLine, ch: newCh });
        }
      } else if (CommandType.SHORTCUT === value.type) {
        this.editor.replaceRange("", this.editorSuggest.start, this.editorSuggest.end)
        this.app.commands.executeCommandById(value.command);
      }
    }
  }
}
