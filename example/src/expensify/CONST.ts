const PLATFORM_OS_MACOS = 'Mac OS';
const PLATFORM_OS_IOS = 'iOS';

const CONST = {
  PLATFORM: {
    IOS: 'ios',
    ANDROID: 'android',
    WEB: 'web',
    DESKTOP: 'desktop',
  },
  PLATFORM_SPECIFIC_KEYS: {
    CTRL: {
      DEFAULT: 'control',
      [PLATFORM_OS_MACOS]: 'meta',
      [PLATFORM_OS_IOS]: 'meta',
    },
    SHIFT: {
      DEFAULT: 'shift',
    },
  },
  KEYBOARD_SHORTCUTS: {
    SEARCH: {
      descriptionKey: 'search',
      shortcutKey: 'K',
      modifiers: ['CTRL'],
    },
    NEW_GROUP: {
      descriptionKey: 'newGroup',
      shortcutKey: 'K',
      modifiers: ['CTRL', 'SHIFT'],
    },
    SHORTCUT_MODAL: {
      descriptionKey: 'openShortcutDialog',
      shortcutKey: 'I',
      modifiers: ['CTRL'],
    },
    ESCAPE: {
      descriptionKey: 'escape',
      shortcutKey: 'Escape',
      modifiers: [],
    },
    ENTER: {
      descriptionKey: null,
      shortcutKey: 'Enter',
      modifiers: [],
    },
    COPY: {
      descriptionKey: 'copy',
      shortcutKey: 'C',
      modifiers: ['CTRL'],
    },
  },
  KEYBOARD_SHORTCUT_KEY_DISPLAY_NAME: {
    CONTROL: 'CTRL',
    ESCAPE: 'ESC',
    META: 'CMD',
    SHIFT: 'Shift',
  },
  OS: {
    WINDOWS: 'Windows',
    MAC_OS: PLATFORM_OS_MACOS,
    ANDROID: 'Android',
    IOS: 'iOS',
    LINUX: 'Linux',
    NATIVE: 'Native',
  },
};

export default CONST;
