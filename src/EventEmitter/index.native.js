import {NativeEventEmitter} from 'react-native';

/**
 * Key command EventEmitter.
 *
 * @param {Object} KeyCommand - Native Module.
 * @returns {Object} EventEmitter instance to register a callback.
 */
function getEventEmitter(KeyCommand) {
    return new NativeEventEmitter(KeyCommand);
}

export default getEventEmitter;
