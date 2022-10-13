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
 * Predefined multiplatform commands list.
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
function registerKeyCommands(keyCommands) {
    return KeyCommand.registerKeyCommands(keyCommands);
}

/**
 * Unregister key command combination list.
 *
 * @param {Object[]} keyCommands - List of key command objects.
 * @param {string} keyCommands[].input - any character key from the keyboard.
 * @param {number} keyCommands[].modifierFlags - predefined command from getConstants enum.
 * @returns {Promise}
 */
function unregisterKeyCommands(keyCommands) {
    return KeyCommand.unregisterKeyCommands(keyCommands);
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
 * Register key command and listen to the event.
 *
 * @param {Object} keyCommand - List of key command objects.
 * @param {string} keyCommand.input - any character key from the keyboard.
 * @param {number} keyCommand.modifierFlags - predefined command from getConstants enum.
 *
 * @param {Function} callback - Callback to be called when the event is triggered.
 * @returns {Function} callback to remove the subscription.
 */
function addListener(keyCommand, callback) {
    registerKeyCommands([keyCommand]);
    const event = eventEmitter.addListener('onKeyCommand', (response) => {
        if (response.input !== keyCommand.input || response.modifierFlags !== keyCommand.modifierFlags) {
            return;
        }
        callback(response);
    });

    return () => {
        event.remove();
        unregisterKeyCommands([keyCommand]);
    };
}

export {
    registerKeyCommands,
    unregisterKeyCommands,
    constants,
    eventEmitter,
    addListener,
};
