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
        return constants.keyModifierShift;
    }
    if (event.ctrlKey) {
        return constants.keyModifierControl;
    }
    if (event.altKey) {
        return constants.keyModifierOption;
    }
    if (event.metaKey) {
        return constants.keyModifierCommand;
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
function registeredCommandIndex(json) {
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
function eventMatchesInput(event) {
    const modifierFlags = getKeyEventModifiers(event);
    return registeredCommandIndex({input: event.key.toLowerCase(), modifierFlags});
}

function onKeyDown(event) {
    const index = eventMatchesInput(event);
    if (index === -1) {
        return;
    }

    EventEmitter.emit('onKeyCommand', commands[index]);
}

function getConstants() {
    return constants;
}

document.removeEventListener('keydown', onKeyDown, {capture: true});
document.addEventListener('keydown', onKeyDown, {capture: true});

/**
 * Register key command.
 *
 * @param {Object} json - List of key command objects.
 * @param {string} json.input - any character key from the keyboard.
 * @param {number} json.modifierFlags - predefined command from getConstants enum.
 */
function registerKeyCommands(json) {
    json.forEach((command) => {
        const index = registeredCommandIndex(command);
        if (index !== -1) {
            return;
        }
        commands.push(command);
    });
}

/**
 * Unregister key command.
 *
 * @param {Object} json - List of key command objects.
 * @param {string} json.input - any character key from the keyboard.
 * @param {number} json.modifierFlags - predefined command from getConstants enum.
 */
function unregisterKeyCommands(json) {
    json.forEach((command) => {
        const index = registeredCommandIndex(command);
        if (index === -1) {
            return;
        }
        delete commands[command];
    });
}

export default {
    getConstants,
    registerKeyCommands,
    unregisterKeyCommands,
    EventEmitter,
};
