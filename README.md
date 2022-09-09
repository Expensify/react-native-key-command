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

React.useEffect(() => {
    const SEARCH_COMMAND = {input: 'f', modifierFlags: KeyCommand.constants.keyModifierCommand};
    return KeyCommand.addListener(SEARCH_COMMAND, console.log);
}, []);
```

Imperative API provides you with a granular control over the library, e.g:
- Declare multiple commands at once
- Declare command in your React component (components/Shortcuts.js) and attach listener globally in your root component (Router.js)
- Implement decoupled Register / Unregister commands

```js
import * as KeyCommand from 'react-native-key-command';

// ...

const SEARCH_COMMAND = {input: 'd', modifierFlags: KeyCommand.constants.keyModifierCommand};

/**
 * Register a command for [k + CMD] combination
 */
KeyCommand.registerKeyCommands([SEARCH_COMMAND]);

/**
 * Add a global event listener that will trigger when any
 * registered keycommand is pressed
 */
KeyCommand.eventEmitter.addListener('onKeyCommand', console.log);

/**
 * Add a global event listener that will trigger when any
 * registered keycommand is pressed
 */
KeyCommand.eventEmitter.addListener('onKeyCommand', console.log);

/**
 * Unregister keycommand
 */
KeyCommand.unregisterKeyCommands([SEARCH_COMMAND]);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
