import {NativeEventEmitter} from 'react-native';

/**
 * Key command Event listener.
 *
 * @param {Object} KeyCommand - Native Module.
 * @returns {Object} eventListener instance to register a callback.
 */
function getEventEmitter(KeyCommand) {
    return new NativeEventEmitter(KeyCommand);
}

export default getEventEmitter;
