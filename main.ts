import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import MentionSuggest from 'src/MentionSuggest';
import { CommandType, DEFAULT_SETTING, NotionPluginSetting, SettingConfig } from 'src/NotionPluginSetting';
import NotionSettingTab from 'src/NotionSettingTab';


export default class NotionPlugin extends Plugin {
	setting: NotionPluginSetting;
	mentionSuggest: MentionSuggest

	async onload() {

		await this.loadSetting()

		console.log('notion setting', this.setting)

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new NotionSettingTab(this.app, this));

		this.mentionSuggest = new MentionSuggest(this.app, this.setting)
		this.registerEditorSuggest(this.mentionSuggest);

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSetting() {
		this.setting = Object.assign({}, DEFAULT_SETTING, await this.loadData());
	}

	async saveSetting(config: SettingConfig) {

		if (CommandType.SHORTCUT === config.type) {
			// 检查 settings 中是否存在与 config.uuid 匹配的项
			const existingIndex = this.setting.shortcutKeys.findIndex(setting => setting.uuid === config.uuid);

			if (existingIndex !== -1) {
				// 存在，更新数据
				this.setting.shortcutKeys[existingIndex] = config;
			} else {
				// 不存在，插入新数据
				this.setting.shortcutKeys.push(config);
			}
		} else if (CommandType.HTML === config.type) {
			// 检查 settings 中是否存在与 config.uuid 匹配的项
			const existingIndex = this.setting.customCommands.findIndex(setting => setting.uuid === config.uuid);

			if (existingIndex !== -1) {
				// 存在，更新数据
				this.setting.customCommands[existingIndex] = config;
			} else {
				// 不存在，插入新数据
				this.setting.customCommands.push(config);
			}
		}
		// 保存数据
		await this.saveData(this.setting);
		this.mentionSuggest.updateSuggestions(this.setting)
	}
	async deleteSetting(config: SettingConfig) {
		if (CommandType.SHORTCUT === config.type) {
			// 检查 settings 中是否存在与 config.uuid 匹配的项
			const existingIndex = this.setting.shortcutKeys.findIndex(setting => setting.uuid === config.uuid);
			if (existingIndex !== -1) {
				// 存在，删除数据
				this.setting.shortcutKeys.splice(existingIndex, 1);
			}
		} else if (CommandType.HTML === config.type) {
			// 检查 settings 中是否存在与 config.uuid 匹配的项
			const existingIndex = this.setting.customCommands.findIndex(setting => setting.uuid === config.uuid);

			if (existingIndex !== -1) {
				/// 存在，删除数据
				this.setting.customCommands.splice(existingIndex, 1);
			}
		}
		// 保存数据
		await this.saveData(this.setting);
		this.mentionSuggest.updateSuggestions(this.setting)
	}

}


