import _ from 'underscore';
import { registerKeyCommand, unregisterKeyCommand, eventEmitter, constants } from 'react-native-key-command';
import getOperatingSystem from './getOperatingSystem';
import CONST from './CONST';

// Handlers for the various keyboard listeners we set up
const eventHandlers = {};

// Documentation information for keyboard shortcuts that are displayed in the keyboard shortcuts informational modal
const documentedShortcuts = {};

/**
 * @returns {Array}
 */
function getDocumentedShortcuts() {
  return _.values(documentedShortcuts);
}

/**
 * Gets modifiers from a keyboard event.
 *
 * @param {Event} event
 * @returns {Array<String>}
 */
function getKeyEventModifiers(event) {
  const modifiers = [];
  if (event.modifierFlags === constants.keyModifierShift) {
    modifiers.push('SHIFT');
  }
  if (event.modifierFlags === constants.keyModifierControl) {
    modifiers.push('CONTROL');
  }
  if (event.modifierFlags === constants.keyModifierAlternate) {
    modifiers.push('ALT');
  }
  if (event.modifierFlags === constants.keyModifierCommand) {
    modifiers.push('META');
  }
  return modifiers;
}

/**
 * Generates the normalized display name for keyboard shortcuts.
 *
 * @param {String} key
 * @param {String|Array<String>} modifiers
 * @returns {String}
 */
function getDisplayName(key, modifiers) {
  let displayName = [key.toUpperCase()];
  if (_.isString(modifiers)) {
    displayName.unshift(modifiers);
  } else if (_.isArray(modifiers)) {
    displayName = [..._.sortBy(modifiers), ...displayName];
  }

  displayName = _.map(displayName, (modifier) =>
    _.get(
      CONST.KEYBOARD_SHORTCUT_KEY_DISPLAY_NAME,
      modifier.toUpperCase(),
      modifier
    )
  );

  return displayName.join(' + ');
}

/**
 * Checks if an event for that key is configured and if so, runs it.
 * @param {Event} event
 * @private
 */
function bindHandlerToKeydownEvent(event) {
  const eventModifiers = getKeyEventModifiers(event);
  const displayName = getDisplayName(event.input, eventModifiers);

  // Loop over all the callbacks
  _.every(eventHandlers[displayName], (callback) => {
    if (!_.isFunction(callback.callback)) {
      return;
    }
    callback.callback(event);
  });
}

// Make sure we don't add multiple listeners
// document.removeEventListener('keydown', bindHandlerToKeydownEvent, {capture: true});
// document.addEventListener('keydown', bindHandlerToKeydownEvent, {capture: true});

/**
 * Unsubscribes a keyboard event handler.
 *
 * @param {String} displayName The display name for the key combo to stop watching
 * @param {String} callbackID The specific ID given to the callback at the time it was added
 * @private
 */
function unsubscribe(displayName, callbackID) {
  eventHandlers[displayName] = _.reject(
    eventHandlers[displayName],
    (callback) => callback.id === callbackID
  );
}

/**
 * Return platform specific modifiers for keys like Control (CMD on macOS)
 *
 * @param {Array<String>} keys
 * @returns {Array}
 */
function getPlatformEquivalentForKeys(keys) {
  const operatingSystem = getOperatingSystem();
  return _.map(keys, (key) => {
    if (!_.has(CONST.PLATFORM_SPECIFIC_KEYS, key)) {
      return key;
    }

    const platformModifiers = CONST.PLATFORM_SPECIFIC_KEYS[key];
    return _.get(
      platformModifiers,
      operatingSystem,
      platformModifiers.DEFAULT || key
    );
  });
}

function getNativeModifiers(modifiers) {
  if (modifiers.length === 1) {
    if (modifiers.includes('CTRL')) {
      return constants.keyModifierCommand;
    }
  }

  if (modifiers.length === 2) {
    if (modifiers.includes('CTRL') && modifiers.includes('SHIFT')) {
      return constants.keyModifierShiftCommand;
    }
  }
}

/**
 * Subscribes to a keyboard event.
 * @param {String} key The key to watch, i.e. 'K' or 'Escape'
 * @param {Function} callback The callback to call
 * @param {String} descriptionKey Translation key for shortcut description
 * @param {String|Array<String>} [modifiers] Can either be shift or control
 * @param {Boolean} [captureOnInputs] Should we capture the event on inputs too?
 * @param {Boolean|Function} [shouldBubble] Should the event bubble?
 * @param {Number} [priority] The position the callback should take in the stack. 0 means top priority, and 1 means less priority than the most recently added.
 * @param {Boolean} [shouldPreventDefault] Should call event.preventDefault after callback?
 * @returns {Function} clean up method
 */
function subscribe(
  key,
  callback,
  descriptionKey,
  modifiers = 'shift',
  captureOnInputs = false,
  shouldBubble = false,
  priority = 0,
  shouldPreventDefault = true
) {
  const platformAdjustedModifiers = getPlatformEquivalentForKeys(modifiers);
  const displayName = getDisplayName(key, platformAdjustedModifiers);
  const nativeModifiers = getNativeModifiers(modifiers);

  if (!_.has(eventHandlers, displayName)) {
    eventHandlers[displayName] = [];

    registerKeyCommand([{ input: key.toLowerCase(), modifierFlags: constants.keyModifierCommand }]);
  }

  const callbackID = Math.random();
  eventHandlers[displayName].splice(priority, 0, {
    id: callbackID,
    callback,
    captureOnInputs,
    shouldPreventDefault,
    shouldBubble,
  });

  if (descriptionKey) {
    documentedShortcuts[displayName] = {
      shortcutKey: key,
      descriptionKey,
      displayName,
      modifiers,
    };
  }

  return () => {
    unregisterKeyCommand([{ input: key, modifierFlags: nativeModifiers }]);
    unsubscribe(displayName, callbackID);
  };
}

/**
 * This module configures a global keyboard event handler.
 *
 * It uses a stack to store event handlers for each key combination. Some additional details:
 *
 *   - By default, new handlers are pushed to the top of the stack. If you pass a >0 priority when subscribing to the key event,
 *     then the handler will get pushed further down the stack. This means that priority of 0 is higher than priority 1.
 *
 *   - When a key event occurs, we trigger callbacks for that key starting from the top of the stack.
 *     By default, events do not bubble, and only the handler at the top of the stack will be executed.
 *     Individual callbacks can be configured with the shouldBubble parameter, to allow the next event handler on the stack execute.
 *
 *   - Each handler has a unique callbackID, so calling the `unsubscribe` function (returned from `subscribe`) will unsubscribe the expected handler,
 *     regardless of its position in the stack.
 */
const KeyboardShortcut = {
  subscribe,
  getDocumentedShortcuts,
};

eventEmitter.addListener('onKeyCommand', bindHandlerToKeydownEvent);

export default KeyboardShortcut;
