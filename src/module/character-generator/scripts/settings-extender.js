/**
 * window.Azzu.SettingsTypes is guaranteed to be initialized on document.ready
 * window.Azzu.ExtendedSettingsConfig is guaranteed to be initialized after Hooks->ready
 */
(() => {
	const SETTINGS_EXTENDER_VERSION = {
		major: 1,
		minor: 1,
		patch: 3
	};

	window.Azzu = window.Azzu || {};
	registerSettingsTypes();
	extendSettingsWindow();

	// Definitions

	/**
	 * Collection of utility methods whose only purpose it is to maintain backwards compatibility.
	 */
	class Compatibility {

		/**
		 * Compatibility for getting the modules list from SettingsConfig
		 *
		 * @param data SettingsConfig.getData() object
		 * @returns data.settings.modules or data.modules
		 */
		static getSettingsConfigModules(data) {
			const below_0_5_3 = data.settings && data.settings.modules;
			const between_0_5_3_and_0_6_0 = data.modules;
			const above_0_6_1 = data.data && data.data.modules;
			return above_0_6_1 || between_0_5_3_and_0_6_0 || below_0_5_3;
		}

		/**
		 * Compatibility for <0.5.3
		 *
		 * @param key the key of the game setting
		 * @returns the game setting object
		 */
		static getGameSettting(key) {
			const settings = game.settings.settings;
			if (settings instanceof Map) {
				return settings.get(key);
			} else {
				return settings[key];
			}
		}
	}

	function registerSettingsTypes() {
		if (window.Azzu.SettingsTypes) {
			return;
		}

		window.Azzu.SettingsTypes = createExtraInputTypes();
	}

	function createExtraInputTypes() {
		const MODIFIERS = {
			ctrlKey: 'Ctrl + ',
			shiftKey: 'Shift + ',
			metaKey: 'Meta + ',
			altKey: 'Alt + '
		};

		function parseModifiers(val, keyProp) {
			return Object.entries(MODIFIERS).reduce((obj, [prop, val]) => {
				if (obj[keyProp].includes(val)) {
					obj[prop] = true;
					obj[keyProp] = obj[keyProp].replace(val, '');
				} else {
					obj[prop] = false;
				}
				return obj;
			}, {[keyProp]: val});
		}

		function formatModifiers(val) {
			return Object.entries(MODIFIERS)
				.reduce((modifier, [mod, str]) => {
					return modifier + (val[mod] ? str : '');
				}, '');
		}

		function modifiersEqual(e, modifiers) {
			return Object.keys(MODIFIERS).reduce((modifiersCorrect, mod) => {
				return modifiersCorrect && (e[mod] === modifiers[mod]);
			}, true);
		}

		function eventIsForBinding(e, binding, keyProp) {
			// "e" may be a jQuery event, we want the original Javascript event though
			e = e.originalEvent || e;

			return modifiersEqual(e, binding) && e[keyProp] === binding[keyProp];
		}

		const IGNORED_KEYS = ['Shift', 'Alt', 'Control', 'Meta', 'F5'];

		function MouseButtonBinding(val) {
			return val;
		}

		MouseButtonBinding._MOUSE_BUTTONS = new Proxy({
			0: 'LeftClick',
			1: 'MiddleClick',
			2: 'RightClick'
		}, {
			get(obj, prop) {
				return prop in obj ? obj[prop] : 'Mouse' + ((+prop) + 1);
			}
		});
		MouseButtonBinding._eventHandlers = {
			mousedown(e) {
				e = e.originalEvent || e;
				e.preventDefault();

				const $input = $(e.target);
				$input.focus();
				$input.val(MouseButtonBinding.format(e));
			},

			keydown(e) {
				e = e.originalEvent || e;
				if (IGNORED_KEYS.includes(e.key)) {
					return;
				}
				e.preventDefault();
				if (e.key === 'Escape') {
					const $input = $(e.target);
					$input.val('');
				}
			}
		};
		MouseButtonBinding.parse = (val) => {
			if (!val) return val;
			const modifiers = parseModifiers(val, 'button');
			if (/Mouse\d/.test(modifiers.button)) {
				modifiers.button = +modifiers.button[5];
			} else {
				modifiers.button = Object.entries(MouseButtonBinding._MOUSE_BUTTONS)
					.reduce((btn, [val, text]) => {
						return btn === text ? +val : btn;
					}, modifiers.button);
			}
			return modifiers;
		};
		MouseButtonBinding.format = (val) => {
			return formatModifiers(val) + MouseButtonBinding._MOUSE_BUTTONS[val.button];
		};
		MouseButtonBinding.eventIsForBinding = (event, button) => {
			return eventIsForBinding(event, button, 'button');
		};

		function KeyBinding(val) {
			return val;
		}

		KeyBinding._LOCATIONS = {
			0: '',
			1: 'Left ',
			2: 'Right ',
			3: 'Numpad '
		};
		KeyBinding._eventHandlers = {
			keydown(e) {
				e = e.originalEvent || e;

				if (IGNORED_KEYS.includes(e.key)) {
					return;
				}

				e.preventDefault();

				const $input = $(e.target);
				if (e.key === 'Escape') {
					$input.val('');
					return;
				}
				$input.val(KeyBinding.format(e));
			}
		};
		KeyBinding.parse = (val) => {
			if (!val) return val;
			const withModifiers = parseModifiers(val, 'key');

			return Object.entries(KeyBinding._LOCATIONS)
				.filter(entry => entry[1] !== '')
				.reduce((obj, [prop, val]) => {
					if (obj.key.includes(val)) {
						obj.location = prop;
						obj.key = obj.key.replace(val, '');
					}
					return obj;
				}, {
					...withModifiers,
					location: 0
				});
		};
		KeyBinding.format = (val) => {
			return formatModifiers(val) + KeyBinding._LOCATIONS[val.location] + val.key;
		};
		KeyBinding.eventIsForBinding = (event, button) => {
			return eventIsForBinding(event, button, 'key');
		};

		function FilePickerImage(val) {
			return val;
		}

		function FilePickerVideo(val) {
			return val;
		}

		function FilePickerImageVideo(val) {
			return val;
		}

		function FilePickerAudio(val) {
			return val;
		}

		const filePickers = {
			FilePickerImage,
			FilePickerVideo,
			FilePickerImageVideo,
			FilePickerAudio
		};
		FilePickerImage._init = ($html) => {
			const base = 'FilePicker';
			const $filePickers = $html.find(`[data-dtype^="${base}"]`);
			$filePickers.each((idx, input) => {
				const $input = $(input);
				const $formGroup = $input.parent();
				$formGroup.find('.hint').css('order', '100');
				const target = $input.attr('name');
				const type = $input.data('dtype').substring(base.length).toLowerCase();
				const $filePickerButton = $(`<button type=button class=file-picker title="Browse Files" tabindex=-1>`
					+ `<i class="fas fa-file-import fa-fw"></i></button>`);
				$filePickerButton.attr('data-type', type);
				$filePickerButton.attr('data-target', target);
				$input.after($filePickerButton);
			});
		};
		Object.values(filePickers).forEach(FilePicker => {
			FilePicker.parse = (val) => val;
			FilePicker.format = (val) => val;
		});

		class DirPicker extends FilePicker {
			constructor(options) {
				super(options);

				this.extensions = [];
			}

			activateListeners($html) {
				super.activateListeners($html);
				$html.find('.form-footer').remove();
				$html.find('.dir').each((idx, li) => {
					const $li = $(li);
					$li.css('padding-left', 0);
					const $selectButton = $('<button type=button>Select</button>');
					$selectButton.css('width', 'auto');
					$selectButton.css('margin-left', '0');
					this._addOnClick($selectButton, $li.data('path'));
					$li.prepend($selectButton)
				});

				$html.find('.note').text('No subdirectories.');

				const $selectCurrent = $('<button type=button>Select current directory</button>');
				this._addOnClick($selectCurrent, $html.find('[name=target]').val());
				$html.append($selectCurrent);
			}

			_addOnClick($selectButton, path) {
				$selectButton.click((event) => {
					event.stopPropagation();
					$(this.field).val(path);
					this.close();
				});
			}
		}

		function DirectoryPicker(val) {
			return val;
		}

		DirectoryPicker.parse = (val) => val;
		DirectoryPicker.format = (val) => val;
		DirectoryPicker._init = ($html) => {
			const $directoryPickers = $html.find(`[data-dtype="${DirectoryPicker.name}"]`);
			$directoryPickers.each((idx, input) => {
				const $input = $(input);
				const $browseButton = $(`<button type=button title="Browse Directories" tabindex=-1>`
					+ `<i class="fas fa-file-import fa-fw"></i></button>`);
				$browseButton.css('flex', '0 0 24px');
				$browseButton.css('line-height', '24px');
				$browseButton.css('margin-left', '4px');
				$input.after($browseButton);
				$browseButton.click((event) => {
					event.preventDefault();
					new DirPicker({
						field: $input,
						current: $input.val(),
						button: $browseButton
					}).browse();
				});
			})
		};


		return {
			MouseButtonBinding,
			KeyBinding,
			...filePickers,
			DirectoryPicker
		};
	}

	function isNewestVersionEnabled() {
		const existingClass = window.Azzu.ExtendedSettingsConfig;
		if (!existingClass) return false;

		const oldVersion = existingClass.settingsExtenderVersion;
		if (!oldVersion) return false;

		const curVersion = SETTINGS_EXTENDER_VERSION;
		return oldVersion.major < curVersion.major
			|| oldVersion.minor < curVersion.minor
			|| oldVersion.patch < curVersion.patch
	}

	function extendSettingsWindow() {
		Hooks.once('ready', () => {
			if (isNewestVersionEnabled()) return;

			window.Azzu.ExtendedSettingsConfig = ExtendedSettingsConfig;
			game.settings._sheet = new ExtendedSettingsConfig(game.settings.settings);
		});
	}

	class ExtendedSettingsConfig extends SettingsConfig {

		static get settingsExtenderVersion() {
			return SETTINGS_EXTENDER_VERSION;
		}

		static get defaultOptions() {
			return mergeObject(super.defaultOptions, {
				baseApplication: 'SettingsConfig'
			});
		}

		getData() {
			const data = super.getData();
			const modules = Compatibility.getSettingsConfigModules(data);
			modules.flatMap(m => m.settings).forEach(setting => {
				const key = setting.module + '.' + setting.key;
				const type = Compatibility.getGameSettting(key).type;
				if (typeof type === 'function') {
					setting.type = type.name;
				} else {
					setting.type = 'unknown'
				}
			});
			return data;
		}

		activateListeners($html) {
			let extraTypes = window.Azzu.SettingsTypes;
			// before super.activateListeners as FormApplication.activateListeners
			// initialises FilePickers
			Object.values(extraTypes).forEach(type => type._init && type._init($html));

			super.activateListeners($html);

			Object.entries(extraTypes).forEach(([name, type]) => {
				if (!type._eventHandlers) return;
				const $inputs = $html.find(`[data-dtype="${name}"`);
				Object.entries(type._eventHandlers).forEach(([eventType, handler]) => {
					$inputs.on(eventType, handler);
				});
			});
		}
	}
})();
