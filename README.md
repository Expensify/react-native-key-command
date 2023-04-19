# react-native-key-command
A cross-platform module that registers and listens to specified keyboard events, dispatching the payload to JavaScript.

✅ Android
✅ iOS
✅ Web

## Installation

```sh
npm install react-native-key-command
```

## iOS

`cd ios && pod install`

Changes required in your `AppDelegate.m`

```
// add library imports in the top of your file 
#import <HardwareShortcuts.h>

@implementation AppDelegate

..

// Add keyCommands and handleKeyCommand methods in AppDelegate class
- (NSArray *)keyCommands {
  return [HardwareShortcuts sharedInstance].keyCommands;
}

- (void)handleKeyCommand:(UIKeyCommand *)keyCommand {
  [[HardwareShortcuts sharedInstance] handleKeyCommand:keyCommand];
}

@end
```

## Android

Changes required in your `MainActivity.java`

```
// add library imports in the top of your file 
import android.view.KeyEvent;
import com.expensify.reactnativekeycommand.KeyCommandModule;

public class MainActivity extends ReactActivity {

  ..

  // Add a new onKeyDown method in MainActivity class
  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    KeyCommandModule.getInstance().onKeyDownEvent(keyCode, event);
    return super.onKeyDown(keyCode, event);
  }
```

## Usage
```js
import * as KeyCommand from 'react-native-key-command';

// ...

/**
 * [CMD + F] combination listener
 */
React.useEffect(() => {
    const SEARCH_COMMAND = {input: 'f', modifierFlags: KeyCommand.constants.keyModifierCommand};
    return KeyCommand.addListener(SEARCH_COMMAND, console.log);
}, []);

/**
 * [Esc] key listener
 */
React.useEffect(() => {
    const ESCAPE_COMMAND = {input: KeyCommand.constants.keyInputEscape};
    return KeyCommand.addListener(ESCAPE_COMMAND, console.log);
}, []);
```

## Constants
List of available modifier flags. Values on Android may vary.

```js
KeyCommand.constants = {
  "keyInputDownArrow": 20,
  "keyInputEscape": 111,
  "keyInputLeftArrow": 21,
  "keyInputRightArrow": 22,
  "keyInputUpArrow": 19,
  "keyModifierCapsLock": 65536,
  "keyModifierCommand": 1048576,
  "keyModifierControl": 262144,
  "keyModifierControlCommand": 1310720,
  "keyModifierControlOption": 786432,
  "keyModifierControlOptionCommand": 1835008,
  "keyModifierNumericPad": 78,
  "keyModifierOption": 524288,
  "keyModifierOptionCommand": 1572864,
  "keyModifierShift": 131072,
  "keyModifierShiftCommand": 1179648
}
```

Imperative API provides you with granular control over the library, e.g:
- Declare multiple commands at once.
- Declare command in your React component (components/Shortcuts.js) and attach listener globally in your root component (Router.js).
- Implement decoupled Register / Unregister commands.

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
