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
    /**
     * command object may have following schema:
     * - {input: 'f', modifierFlags: 123}
     * - {input: 'f'}
     * - {input: '123'}
     */
    if (!keyCommand || !keyCommand.input) {
        throw new Error('Input property for keyCommand object must be provided.');
    }

    if (keyCommand.input && typeof keyCommand.input !== 'string') {
        return {...keyCommand, input: `${keyCommand.input}`};
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
    if (!keyCommands.length) {
        throw new Error('KeyCommands array must not be empty.');
    }

    const validatedKeyCommands = _.map(keyCommands, validateKeyCommand);
    return validatedKeyCommands;
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
        const isInputMatched = (response.input.toLowerCase()) === (validatedKeyCommand.input.toLowerCase());
        const isCommandMatched = (response.modifierFlags || 0) === (validatedKeyCommand.modifierFlags || 0);

        if (!validatedKeyCommand.modifierFlags && isInputMatched) {
            callback(response);
        }

        if (validatedKeyCommand.modifierFlags && isInputMatched && isCommandMatched) {
            callback(response);
        }
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
