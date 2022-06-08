# react-native-key-command

React Native Key Command

## Installation

```sh
npm install react-native-key-command
```

## Usage

```js
import { registerKeyCommand, unregisterKeyCommand, eventEmitter, constants } from 'react-native-key-command';

// Register key command handler
useEffect(() => {
  registerKeyCommand([{ input: 'k', modifierFlags: constants.keyModifierCommand }])

  return () => {
    unregisterKeyCommand([{ input: 'k', modifierFlags: constants.keyModifierCommand }])
  }
}, [])

// Register event listener
useEffect(() => {
  const subscription = eventEmitter.addListener('onKeyCommand', console.log);

  return () => {
    subscription.remove();
  }
}, [])
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
