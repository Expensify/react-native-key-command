import {NativeModules, NativeEventEmitter, Platform} from 'react-native';

const PLATFORM_ERROR_MESSAGE = Platform.select({ios: "- You have run 'pod install'\n", default: ''});
const LINKING_ERROR = `The package 'react-native-key-command' doesn't seem to be linked. Make sure: \n\n
${PLATFORM_ERROR_MESSAGE}\n
- You rebuilt the app after installing the package\n
- You are not using Expo managed workflow\n`;

const KeyCommand = NativeModules.KeyCommand ? NativeModules.KeyCommand : new Proxy(
    {},
    {
        get() {
            throw new Error(LINKING_ERROR);
        },
    },
);

function getConstants() {
    return KeyCommand.getConstants();
}

function registerKeyCommand(keyCommands) {
    return KeyCommand.registerKeyCommand(keyCommands);
}

function unregisterKeyCommand(keyCommands) {
    return KeyCommand.unregisterKeyCommand(keyCommands);
}

function getEventEmitter() {
    return new NativeEventEmitter(KeyCommand);
}

const constants = getConstants();
const eventEmitter = getEventEmitter();

export {
    registerKeyCommand,
    unregisterKeyCommand,
    constants,
    eventEmitter,
};
