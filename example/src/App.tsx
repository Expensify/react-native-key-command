import React, { FC } from 'react';
import { Text, View, Switch, StyleSheet, SafeAreaView } from 'react-native';
import {
  registerKeyCommand,
  unregisterKeyCommand,
  eventEmitter,
  constants,
} from 'react-native-key-command';

type PostsProps = {};

export default () => {
  const [history, setHistory] = React.useState([]);
  const [toggles, setToggles] = React.useState({
    searchShortcut: false,
    copyShortcut: false,
    modalShortcut: false,
    groupShortcut: false,
  });

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setHistory(() => []);
    }, 5000);

    eventEmitter.removeAllListeners('onKeyCommand');
    eventEmitter.addListener('onKeyCommand', (res) => {
      const response = JSON.stringify(res);
      setHistory((state) => state.concat(response));
    });

    return () => clearInterval(intervalId);
  }, []);

  const handleToggle = (name: string) => (value: boolean) => {
    setToggles((state) => ({
      ...state,
      [name]: value,
    }));

    if (value) {
      if (name === 'searchShortcut') {
        registerKeyCommand([
          { input: 'k', modifierFlags: constants.keyModifierCommand },
        ]);
      }
      if (name === 'copyShortcut') {
        registerKeyCommand([
          { input: 'k', modifierFlags: constants.keyModifierShiftCommand },
        ]);
      }
      if (name === 'modalShortcut') {
        registerKeyCommand([
          { input: 'i', modifierFlags: constants.keyModifierCommand },
        ]);
      }
      if (name === 'groupShortcut') {
        registerKeyCommand([
          { input: 'c', modifierFlags: constants.keyModifierCommand },
        ]);
      }
    } else {
      if (name === 'searchShortcut') {
        unregisterKeyCommand([
          { input: 'k', modifierFlags: constants.keyModifierCommand },
        ]);
      }
      if (name === 'copyShortcut') {
        unregisterKeyCommand([
          { input: 'k', modifierFlags: constants.keyModifierShiftCommand },
        ]);
      }
      if (name === 'modalShortcut') {
        unregisterKeyCommand([
          { input: 'i', modifierFlags: constants.keyModifierCommand },
        ]);
      }
      if (name === 'groupShortcut') {
        unregisterKeyCommand([
          { input: 'c', modifierFlags: constants.keyModifierCommand },
        ]);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shortcuts}>
        <View style={styles.row}>
          <Switch onValueChange={handleToggle('searchShortcut')} value={toggles.searchShortcut} />
          <Text style={styles.textLarge}>CTRL + K</Text>
        </View>

        <View style={styles.row}>
          <Switch onValueChange={handleToggle('copyShortcut')} value={toggles.copyShortcut} />
          <Text style={styles.textLarge}>CTRL + SHIFT + K</Text>
        </View>

        <View style={styles.row}>
          <Switch onValueChange={handleToggle('modalShortcut')} value={toggles.modalShortcut} />
          <Text style={styles.textLarge}>CTRL + I</Text>
        </View>

        <View style={styles.row}>
          <Switch onValueChange={handleToggle('groupShortcut')} value={toggles.groupShortcut} />
          <Text style={styles.textLarge}>CTRL + C</Text>
        </View>
      </View>

      <View style={styles.history}>
        {history.map(item => (
          <Text style={styles.textSmall}>CTRL + C</Text>
        ))}

        <Text style={[styles.textSmall, styles.textHelper]}>History is cleared every 5 seconds</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLarge: {
    padding: 12,
  },
  shortcuts: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 4,
    marginBottom: 24,
  },
  history: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textSmall: {
    paddingVertical: 6,
  },
  textHelper: {
    paddingVertical: 6,
    color: '#333',
    textAlign: 'right',
    fontStyle: 'italic',
  },
});
