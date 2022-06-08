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

## Installation Android
```
// MainActivity.java
import android.view.KeyEvent;
import com.reactnativekeycommand.KeycommandlibModule;

@Override
public boolean onKeyDown(int keyCode, KeyEvent event) {
  KeycommandlibModule.getInstance().onKeyDownEvent(keyCode, event);
  return super.onKeyDown(keyCode, event);
}

@Override
public boolean onKeyMultiple(int keyCode, int repeatCount, KeyEvent event) {
  KeycommandlibModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event);
  return super.onKeyMultiple(keyCode, repeatCount, event);
}

@Override
public boolean onKeyUp(int keyCode, KeyEvent event) {
  KeycommandlibModule.getInstance().onKeyUpEvent(keyCode, event);
  return super.onKeyUp(keyCode, event);
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
