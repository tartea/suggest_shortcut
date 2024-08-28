import NotionPlugin from 'main';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { CommandType, SettingConfig } from './NotionPluginSetting';



class NotionSettingTab extends PluginSettingTab {
  plugin: NotionPlugin;
  inputCount: number; // 记录当前输入框的数量

  constructor(app: App, plugin: NotionPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.inputCount = 0; // 初始化输入框数量
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.addClass("notion_setting")

    // 渲染快捷命令
    this.renderingShortcut(containerEl)

    // 渲染自定义命令
    this.renderingCommand(containerEl)
  }

  /**
   * 渲染快捷命令
   * @param containerEl 
   */
  renderingShortcut(containerEl: HTMLElement): void {
    // 添加设置文本框
    new Setting(containerEl)
      .setName('Shortcut keys')
      .setDesc('You can add shortcut keys and receive prompts on the editing page');

    // 添加下划线
    const separator = containerEl.createDiv();
    separator.setCssStyles({
      borderBottom: '1px solid #ccc',
      margin: '10px 0', // 添加上下边距
    });

    // 添加动态生成的输入框区域
    const dynamicInputContainer = containerEl.createDiv();

    if (this.plugin.setting && this.plugin.setting.shortcutKeys.length > 0) {
      this.plugin.setting.shortcutKeys.forEach(item => {
        this.addDynamicInput(dynamicInputContainer, CommandType.SHORTCUT, item);
      })
    }

    // 添加按钮
    new Setting(containerEl)
      .addButton(button => {
        button.setButtonText('Add Shortcut Key')
          .onClick(() => {
            this.addDynamicInput(dynamicInputContainer, CommandType.SHORTCUT);
          });
      });
  }

  /**
  * 渲染快捷命令
  * @param containerEl 
  */
  renderingCommand(containerEl: HTMLElement): void {
    // 添加设置文本框
    new Setting(containerEl)
      .setName('Command keys')
      .setDesc('You can input the md command as a command');

    // 添加下划线
    const separator = containerEl.createDiv();
    separator.setCssStyles({
      borderBottom: '1px solid #ccc',
      margin: '10px 0', // 添加上下边距
    });

    // 添加动态生成的输入框区域
    const dynamicInputContainer = containerEl.createDiv();

    if (this.plugin.setting && this.plugin.setting.customCommands.length > 0) {
      this.plugin.setting.customCommands.forEach(item => {
        this.addDynamicInput(dynamicInputContainer, CommandType.HTML, item);
      })
    }

    // 添加按钮
    new Setting(containerEl)
      .addButton(button => {
        button.setButtonText('Add Command Key')
          .onClick(() => {
            this.addDynamicInput(dynamicInputContainer, CommandType.HTML);
          });
      });
  }

  // 动态添加输入框的方法
  addDynamicInput(container: HTMLElement, commandType: CommandType, config?: SettingConfig): void {

    // 创建一个新的 div，用于承载三个输入框
    const inputRow = container.createDiv();

    inputRow.addClass('notion_input_row')

    new Setting(inputRow)
      .setName('快捷键')

    // 如果 config 中有 initialValue，则设置为输入的初始值
    if (config == null) {
      config = {
        uuid: this.generateUUID(),
        title: '',
        search: '',
        command: '',
        type: commandType
      }
    }
    // 渲染每一行
    this.renderingSettingRow(inputRow, config)

  }

  renderingSettingRow(inputRow: HTMLElement, config: SettingConfig) {
    // 创建三个输入框
    new Setting(inputRow)
      .addText(text => text
        .setPlaceholder(`名称`)
        .setValue(`${config.title}`)
        .onChange(async (value) => {
          config.title = value;
          this.plugin.saveSetting(config)
        }));
    new Setting(inputRow)
      .addText(text => text
        .setPlaceholder(`指令`)
        .setValue(`${config.search}`)
        .onChange(async (value) => {
          config.search = value;
          this.plugin.saveSetting(config)
        }));
    new Setting(inputRow)
      .addTextArea(text => text
        .setPlaceholder(`命令`)
        .setValue(`${config.command}`)
        .onChange(async (value) => {
          config.command = value;
          this.plugin.saveSetting(config)
        }));

    new Setting(inputRow)
      .addButton(button => {
        button.setIcon("delete")
          .onClick(() => {
            this.plugin.deleteSetting(config)
            this.display()
          });
      });
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0; // 生成一个随机数并取整
      const v = c === 'x' ? r : (r % 4 + 8); // 如果是 'x'，返回随机数，'y' 需要满足特定条件
      return v.toString(16); // 将数字转换为十六进制
    });
  }
}


export default NotionSettingTab