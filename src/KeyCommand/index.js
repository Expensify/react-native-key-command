import _ from 'underscore';
import Events from 'events';

const EventEmitter = new Events();

/**
 * Wrap addListener with custom return to match RN NativeEventEmitter API.
 *
 * @param {string} type - Event name.
 * @param {Function} callback - Callback to be called when the event is triggered.
 * @returns {Object}
 */
EventEmitter.addListener = (type, callback) => {
    EventEmitter.on(type, callback);
    return {
        remove: () => EventEmitter.removeListener(type, callback),
    };
};

const commands = [];
const constants = {
    keyInputDownArrow: 'keyInputDownArrow',
    keyInputEscape: 'keyInputEscape',
    keyInputLeftArrow: 'keyInputLeftArrow',
    keyInputRightArrow: 'keyInputRightArrow',
    keyInputUpArrow: 'keyInputUpArrow',
    keyModifierCapsLock: 'keyModifierCapsLock',
    keyModifierCommand: 'keyModifierCommand',
    keyModifierControl: 'keyModifierControl',
    keyModifierControlShift: 'keyModifierControlShift',
    keyModifierControlCommand: 'keyModifierControlCommand',
    keyModifierControlOption: 'keyModifierControlOption',
    keyModifierControlOptionCommand: 'keyModifierControlOptionCommand',
    keyModifierNumericPad: 'keyModifierNumericPad',
    keyModifierOption: 'keyModifierOption',
    keyModifierOptionCommand: 'keyModifierOptionCommand',
    keyModifierShift: 'keyModifierShift',
    keyModifierShiftCommand: 'keyModifierShiftCommand',
};

/**
 * Gets modifiers from a keyboard event.
 *
 * @param {Event} event
 * @returns {Array<String>}
 */
function getKeyEventModifiers(event) {
    const modifiers = [];
    if (event.shiftKey) {
        modifiers.push(constants.keyModifierShift);
    }
    if (event.ctrlKey) {
        modifiers.push(constants.keyModifierControl);
    }
    if (event.altKey) {
        modifiers.push(constants.keyModifierOption);
    }
    if (event.metaKey) {
        modifiers.push(constants.keyModifierCommand);
    }

    if (modifiers.length === 1) {
        return modifiers.pop();
    }

    if (modifiers.length === 2) {
        if (modifiers.includes(constants.keyModifierControl) && modifiers.includes(constants.keyModifierShift)) {
            return constants.keyModifierControlShift;
        }
        if (modifiers.includes(constants.keyModifierControl) && modifiers.includes(constants.keyModifierCommand)) {
            return constants.keyModifierControlCommand;
        }
        if (modifiers.includes(constants.keyModifierControl) && modifiers.includes(constants.keyModifierOption)) {
            return constants.keyModifierControlOption;
        }
        if (modifiers.includes(constants.keyModifierOption) && modifiers.includes(constants.keyModifierCommand)) {
            return constants.keyModifierOptionCommand;
        }
        if (modifiers.includes(constants.keyModifierShift) && modifiers.includes(constants.keyModifierCommand)) {
            return constants.keyModifierShiftCommand;
        }
    }

    return modifiers;
}

/**
 * Finds index of register key command and listen to the event.
 *
 * @param {Object} json - List of key command objects.
 * @param {string} json.input - any character key from the keyboard.
 * @param {number} json.modifierFlags - predefined command from getConstants enum.
 *
 * @returns {number} index of registered keyCommand.
 */
function getRegisteredCommandIndex(json) {
    const matchesModifierFlags = item => (
        item.modifierFlags === json.modifierFlags
        || (_.isEmpty(item.modifierFlags) && _.isEmpty(json.modifierFlags))
    );

    const matchesEscape = item => (item.input === constants.keyInputEscape && json.input === 'escape');

    return _.findIndex(commands, item => (
        item.input === json.input
        && matchesModifierFlags(item)
    ) || matchesEscape(item));
}

/**
 * Checks if event exists in registered key command array and returns index.
 *
 * @param {Event} event
 * @returns {number} index of registered keyCommand.
 */
function getMatchedInputIndex(event) {
    const modifierFlags = getKeyEventModifiers(event);
    return getRegisteredCommandIndex({input: event.key.toLowerCase(), modifierFlags});
}

function onKeyDown(event) {
    const index = getMatchedInputIndex(event);
    if (index === -1) {
        return;
    }

    EventEmitter.emit('onKeyCommand', commands[index], event);
}

function getConstants() {
    return constants;
}

/**
 * Register key command.
 *
 * @param {Object} keyCommands - List of key command objects.
 * @param {string} keyCommands.input - any character key from the keyboard.
 * @param {number} keyCommands.modifierFlags - predefined command from getConstants enum.
 */
function registerKeyCommands(keyCommands) {
    keyCommands.forEach((command) => {
        const index = getRegisteredCommandIndex(command);
        if (index !== -1) {
            return;
        }
        commands.push(command);
    });
}

/**
 * Unregister key command.
 *
 * @param {Object} keyCommands - List of key command objects.
 * @param {string} keyCommands.input - any character key from the keyboard.
 * @param {number} keyCommands.modifierFlags - predefined command from getConstants enum.
 */
function unregisterKeyCommands(keyCommands) {
    keyCommands.forEach((command) => {
        const index = getRegisteredCommandIndex(command);
        if (index === -1) {
            return;
        }
        delete commands[command];
    });
}

document.removeEventListener('keydown', onKeyDown, {capture: true});
document.addEventListener('keydown', onKeyDown, {capture: true});

export default {
    getConstants,
    registerKeyCommands,
    unregisterKeyCommands,
    EventEmitter,
};
