# react-native-key-command
react-native-key-command
## Installation

```sh
npm install react-native-key-command
```

## Usage

```js
import * as KeyCommand from 'react-native-key-command';

// ...

/**
 * Register a command for [k + CMD] combination
 */
KeyCommand.registerKeyCommand([
  {input: 'd', modifierFlags: KeyCommand.constants.keyModifierCommand},
]);

/**
 * Add an event listener
 */
KeyCommand.eventEmitter.addListener('onKeyCommand', console.log);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
