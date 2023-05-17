import _ from 'underscore';
// eslint-disable-next-line
import * as Keycommand from '../../src/KeyCommand/index.js';

const {
    default: {
        getConstants,
        registerKeyCommands,
        unregisterKeyCommands,
        getRegisteredCommandIndex,
    },
} = Keycommand;

const constants = getConstants();

const commands = [
    {input: constants.keyInputEscape},
    {input: constants.keyInputEnter},
    {input: constants.keyInputEscape, modifierFlags: constants.keyModifierCommand},
    {input: constants.keyInputEnter, modifierFlags: constants.keyModifierCommand},
    {input: constants.keyInputDownArrow, modifierFlags: constants.keyModifierCommand},
];

describe('KeyCommand getRegisteredCommandIndex', () => {
    beforeAll(() => {
        registerKeyCommands(commands);
    });

    afterAll(() => {
        unregisterKeyCommands(commands);
    });

    it('should return correct command given that an exact match exists', () => {
        _.map(commands, (command, index) => {
            expect(getRegisteredCommandIndex(command)).toBe(index);
        });

        _.map([...commands].reverse(), (command, index) => {
            expect(getRegisteredCommandIndex(command)).toBe(commands.length - 1 - index);
        });
    });

    it('should return -1 if command does not exist', () => {
        expect(getRegisteredCommandIndex({
            input: constants.keyInputDownArrow,
        })).toBe(-1);
    });
});
