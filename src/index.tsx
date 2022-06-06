import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'keycommandlib' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const KeyCommand = NativeModules.KeyCommand
  ? NativeModules.KeyCommand
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

type TKeyCommand = {
  input: String;
  modifierFlags: String;
};

export function registerKeyCommand(
  keycommands: TKeyCommand[]
): Promise<number> {
  return KeyCommand.registerKeyCommand(keycommands);
}

export function unregisterKeyCommand(
  keycommands: TKeyCommand[]
): Promise<number> {
  return KeyCommand.unregisterKeyCommand(keycommands);
}

export const eventEmitter = new NativeEventEmitter(KeyCommand);

export const constants = KeyCommand.getConstants();
