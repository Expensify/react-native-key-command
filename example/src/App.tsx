import KeyboardShortcut from './expensify/Shortcuts';
import CONST from './expensify/CONST';

/**
 * Library default usage example:
 * registerKeyCommand([{ input: 'k', modifierFlags: constants.keyModifierCommand }]);
 */
const searchShortcutConfig = CONST.KEYBOARD_SHORTCUTS.SEARCH;
KeyboardShortcut.subscribe(
  searchShortcutConfig.shortcutKey,
  () => {
    console.log('called: KEYBOARD_SHORTCUTS.SEARCH');
  },
  searchShortcutConfig.descriptionKey,
  searchShortcutConfig.modifiers,
  true
);

const copyShortcutConfig = CONST.KEYBOARD_SHORTCUTS.COPY;
KeyboardShortcut.subscribe(
  copyShortcutConfig.shortcutKey,
  () => {
    console.log('called: KEYBOARD_SHORTCUTS.COPY');
  },
  copyShortcutConfig.descriptionKey,
  copyShortcutConfig.modifiers,
  false
);

const modalShortcutConfig = CONST.KEYBOARD_SHORTCUTS.SHORTCUT_MODAL;
KeyboardShortcut.subscribe(
  modalShortcutConfig.shortcutKey,
  () => {
    console.log('called: KEYBOARD_SHORTCUTS.SHORTCUT_MODAL');
  },
  modalShortcutConfig.descriptionKey,
  modalShortcutConfig.modifiers,
  true
);

const groupShortcutConfig = CONST.KEYBOARD_SHORTCUTS.NEW_GROUP;
KeyboardShortcut.subscribe(
  groupShortcutConfig.shortcutKey,
  () => {
    console.log('called: KEYBOARD_SHORTCUTS.NEW_GROUP');
  },
  groupShortcutConfig.descriptionKey,
  groupShortcutConfig.modifiers,
  true
);

export default function App() {
  return null;
}
