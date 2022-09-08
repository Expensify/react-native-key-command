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

/**
 * predefined multiplatform commands list.
 *
 * @returns {Object} predefined command from getConstants enum.
 */
function getConstants() {
    return KeyCommand.getConstants();
}

/**
 * Registers key command combination list.
 *
 * @param {Object[]} keyCommands - List of key command objects.
 * @param {string} keyCommands[].input - any character key from the keyboard.
 * @param {number} keyCommands[].modifierFlags - predefined command from getConstants enum.
 * @returns {Promise}
 */
function registerKeyCommand(keyCommands) {
    return KeyCommand.registerKeyCommand(keyCommands);
}

/**
 * Unregister key command combination list.
 *
 * @param {Object[]} keyCommands - List of key command objects.
 * @param {string} keyCommands[].input - any character key from the keyboard.
 * @param {number} keyCommands[].modifierFlags - predefined command from getConstants enum.
 * @returns {Promise}
 */
function unregisterKeyCommand(keyCommands) {
    return KeyCommand.unregisterKeyCommand(keyCommands);
}

/**
 * Key command Event listener.
 *
 * @returns {Object} eventListener instance to register a callback.
 */
function getEventEmitter() {
    return new NativeEventEmitter(KeyCommand);
}

const constants = getConstants();
const eventEmitter = getEventEmitter();

/**
 * Key command Event listener.
 *
 * @param {string} keyCommand - Event name to listen to.
 * @param {Function} callback - Callback to be called when the event is triggered.
 * @returns {Function} eventListener instance to register a callback.
 */
function addListener(keyCommand, callback) {
    registerKeyCommand([keyCommand]);
    const event = eventEmitter.addListener('onKeyCommand', (response) => {
        if (response.input !== keyCommand.input || response.modifierFlags !== keyCommand.modifierFlags) {
            return;
        }

        callback(response);
    });

    return () => {
        event.remove();
        unregisterKeyCommand([keyCommand]);
    };
}

export {
    registerKeyCommand,
    unregisterKeyCommand,
    constants,
    eventEmitter,
    addListener,
};
