/**
 * Key command EventEmitter.
 *
 * @param {Object} KeyCommand - Native Module.
 * @returns {Object} EventEmitter instance to register a callback.
 */
function getEventEmitter(KeyCommand) {
    return KeyCommand.EventEmitter;
}

export default getEventEmitter;
