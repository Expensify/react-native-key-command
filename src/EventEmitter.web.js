/**
 * Key command Event listener.
 *
 * @param {Object} KeyCommand - Native Module.
 * @returns {Object} eventListener instance to register a callback.
 */
function getEventEmitter(KeyCommand) {
    return KeyCommand.EventEmitter;
}

export default getEventEmitter;
