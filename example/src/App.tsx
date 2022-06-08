import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import KeyboardShortcut from './expensify/Shortcuts';
import CONST from './expensify/CONST';

export default function App() {
  React.useEffect(() => {
    /**
     * Library default usage example:
     * registerKeyCommand([{ input: 'k', modifierFlags: constants.keyModifierCommand }]);
     */
    const searchShortcutConfig = CONST.KEYBOARD_SHORTCUTS.SEARCH;
    const searchShortcutSubscription = KeyboardShortcut.subscribe(
      searchShortcutConfig.shortcutKey,
      () => {
        const message = 'called: KEYBOARD_SHORTCUTS.SEARCH';
        alert(message);
        console.log(message);
      },
      searchShortcutConfig.descriptionKey,
      searchShortcutConfig.modifiers,
      true
    );

    const copyShortcutConfig = CONST.KEYBOARD_SHORTCUTS.COPY;
    const copyShortcutSubscription = KeyboardShortcut.subscribe(
      copyShortcutConfig.shortcutKey,
      () => {
        const message = 'called: KEYBOARD_SHORTCUTS.COPY';
        alert(message);
        console.log(message);
      },
      copyShortcutConfig.descriptionKey,
      copyShortcutConfig.modifiers,
      false
    );

    const modalShortcutConfig = CONST.KEYBOARD_SHORTCUTS.SHORTCUT_MODAL;
    const modalShortcutSubscription = KeyboardShortcut.subscribe(
      modalShortcutConfig.shortcutKey,
      () => {
        const message = 'called: KEYBOARD_SHORTCUTS.SHORTCUT_MODAL';
        alert(message);
        console.log(message);
      },
      modalShortcutConfig.descriptionKey,
      modalShortcutConfig.modifiers,
      true
    );

    const groupShortcutConfig = CONST.KEYBOARD_SHORTCUTS.NEW_GROUP;
    const groupShortcutSubscription = KeyboardShortcut.subscribe(
      groupShortcutConfig.shortcutKey,
      () => {
        const message = 'called: KEYBOARD_SHORTCUTS.NEW_GROUP';
        alert(message);
        console.log(message);
      },
      groupShortcutConfig.descriptionKey,
      groupShortcutConfig.modifiers,
      true
    );

    return () => {
      searchShortcutSubscription.remove();
      copyShortcutSubscription.remove();
      modalShortcutSubscription.remove();
      groupShortcutSubscription.remove();
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Go check your console, available shortcuts are:</Text>

      <Text style={styles.item}>→ CTRL + K</Text>
      <Text style={styles.item}>→ CTRL + SHIFT + K</Text>
      <Text style={styles.item}>→ CTRL + I</Text>
      <Text style={styles.item}>→ CTRL + C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    padding: 24,
    fontWeight: '600',
  },
  item: {
    fontSize: 24,
    padding: 12,
  },
});
