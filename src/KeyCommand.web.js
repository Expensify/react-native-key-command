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

function registeredCommandIndex(json) {
    return _.findIndex(commands, item => item.input === json.input && item.modifierFlags === json.modifierFlags);
}

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

document.removeEventListener('keydown', onKeyDown, {capture: true});
document.addEventListener('keydown', onKeyDown, {capture: true});

function getConstants() {
    return constants;
}

function registerKeyCommands(json) {
    json.forEach((command) => {
        const index = registeredCommandIndex(command);
        if (index !== -1) {
            return;
        }
        commands.push(command);
    });
}

function unregisterKeyCommands(json) {
    json.forEach((command) => {
        const index = registeredCommandIndex(command);
        if (index === -1) {
            return;
        }
        delete commands[command];
    });
}

registerKeyCommands([{input: 'g', modifierFlags: constants.keyModifierShift}]);

export default {
    getConstants,
    registerKeyCommands,
    unregisterKeyCommands,
    EventEmitter,
};
