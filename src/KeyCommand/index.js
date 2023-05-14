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
    keyInputEnter: 'keyInputEnter',
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
    keyModifierShiftControl: 'keyModifierShiftControl',
    keyModifierAlternate: 'keyModifierAlternate',
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
            return constants.keyModifierShiftControl;
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
        if (modifiers.includes(constants.keyModifierCommand) && modifiers.includes(constants.keyModifierShift)) {
            return constants.keyModifierCommandShift;
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
    const matchesEnter = item => (item.input === constants.keyInputEnter && json.input === 'enter');
    const matchesUpArrow = item => (item.input === constants.keyInputUpArrow && json.input === 'arrowup');
    const matchesDownArrow = item => (item.input === constants.keyInputDownArrow && json.input === 'arrowdown');
    const matchesLeftDown = item => (item.input === constants.keyInputLeftArrow && json.input === 'arrowleft');
    const matchesRightDown = item => (item.input === constants.keyInputRightArrow && json.input === 'arrowright');

    // This does a strict check first to see if there is a match
    // https://github.com/Expensify/App/issues/18480
    const strictIndex = _.findIndex(commands, item => (
        (item.input === json.input && matchesModifierFlags(item))
        || (matchesEnter(item) && matchesModifierFlags(item))
    ));

    if (strictIndex < 0) {
        return _.findIndex(commands, item => (
            matchesEscape(item)
            || matchesEnter(item)
            || matchesUpArrow(item)
            || matchesDownArrow(item)
            || matchesLeftDown(item)
            || matchesRightDown(item)
        ));
    }

    return strictIndex;
}

/**
 * Checks if event exists in registered key command array and returns index.
 *
 * @param {Event} event
 * @returns {number} index of registered keyCommand.
 */
function getMatchedInputIndex(event) {
    const modifierFlags = getKeyEventModifiers(event);

    // Event key may be undefined in some cases, such as when autocomplete is used on a text input
    const input = event.key ? event.key.toLowerCase() : undefined;

    return getRegisteredCommandIndex({input, modifierFlags});
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

// `window` is not available, so `window.document` (or simply `document`) will fail.
if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', onKeyDown, {capture: true});
    document.addEventListener('keydown', onKeyDown, {capture: true});
}

export default {
    getConstants,
    registerKeyCommands,
    unregisterKeyCommands,
    EventEmitter,
};
