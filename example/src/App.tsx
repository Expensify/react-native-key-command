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
    console.log(321);
  },
  searchShortcutConfig.descriptionKey,
  searchShortcutConfig.modifiers,
  true
);

export default function App() {
  return null;
}
