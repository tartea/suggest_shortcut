import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import MentionSuggest from 'src/MentionSuggest';
import { DEFAULT_SETTINGS, NotionPluginSettings, SettingConfig } from 'src/NotionPluginSettings';
import NotionSettingTab from 'src/NotionSettingTab';

// Remember to rename these classes and interfaces!



export default class NotionPlugin extends Plugin {
	setting: NotionPluginSettings;

	async onload() {

		await this.loadSettings()

		console.log('notion setting', this.setting)


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new NotionSettingTab(this.app, this));

		this.registerEditorSuggest(new MentionSuggest(this.app, this.setting.shortcutKeys));



		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.setting = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(config: SettingConfig) {
		// 检查 settings 中是否存在与 config.uuid 匹配的项
		const existingIndex = this.setting.shortcutKeys.findIndex(setting => setting.uuid === config.uuid);

		if (existingIndex !== -1) {
			// 存在，更新数据
			this.setting.shortcutKeys[existingIndex] = config;
		} else {
			// 不存在，插入新数据
			this.setting.shortcutKeys.push(config);
		}
		// 保存数据
		await this.saveData(this.setting);
	}

}


