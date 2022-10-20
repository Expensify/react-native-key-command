import {NativeModules, NativeEventEmitter, Platform} from 'react-native';
import _ from 'underscore';

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

function validateKeyCommand(keyCommand) {
    if (keyCommand.input && typeof keyCommand.input !== 'string') {
        // eslint-disable-next-line
        console.error('input property for keyCommand object must be a string. skipping.');
        return;
    }

    if (!keyCommand.modifierFlags || !Number.isInteger(keyCommand.modifierFlags)) {
        // eslint-disable-next-line
        console.error('modifierFlags property for keyCommand object must be an integer. skipping.');
        return;
    }

    // assigning empty input for single commands e.g. Esc
    if (!keyCommand.input) {
        return {...keyCommand, input: ''};
    }

    return keyCommand;
}

/**
 * Validates key command combination list.
 *
 * @param {Object[]} keyCommands - List of key command objects.
 * @param {string} keyCommands[].input - any character key from the keyboard.
 * @param {number} keyCommands[].modifierFlags - predefined command from getConstants enum.
 * @returns {Promise}
 */
function validateKeyCommands(keyCommands) {
    const validatedKeyCommands = _.map(keyCommands, validateKeyCommand);
    const filteredKeyCommands = _.filter(validatedKeyCommands, item => item);

    if (!filteredKeyCommands.length) {
        console.error('keyCommands array must not be empty.');
    }

    return filteredKeyCommands;
}

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
    const validatedKeyCommands = validateKeyCommands(keyCommands);
    return KeyCommand.registerKeyCommands(validatedKeyCommands);
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
    const validatedKeyCommands = validateKeyCommands(keyCommands);
    return KeyCommand.unregisterKeyCommands(validatedKeyCommands);
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
    const validatedKeyCommand = validateKeyCommand(keyCommand);
    registerKeyCommands([validatedKeyCommand]);

    const event = eventEmitter.addListener('onKeyCommand', (response) => {
        /**
         * Native string representation may appear visibly empty but contain special characters
         * such as \u0000. Therefore comparing by unicode value.
         */
        const isInputMatched = (response.input.charCodeAt(0) || 0) === (validatedKeyCommand.input.charCodeAt(0) || 0);
        const isCommandMatched = response.modifierFlags === validatedKeyCommand.modifierFlags;

        if (!isInputMatched || !isCommandMatched) {
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
