package com.reactnativekeycommand;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.ReadableArray;

import android.view.KeyEvent;

import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.HashMap;

@ReactModule(name = KeyCommandModule.NAME)
public class KeyCommandModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext = null;
  private DeviceEventManagerModule.RCTDeviceEventEmitter mJSModule = null;
  private static KeyCommandModule instance = null;
  private static HashSet<KeyCommands> commands = new HashSet<>();

  public static final String NAME = "KeyCommand";

  public KeyCommandModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.commands = new HashSet();
  }

  public static KeyCommandModule initKeyCommandModule(ReactApplicationContext reactContext) {
    instance = new KeyCommandModule(reactContext);
    return instance;
  }

  public static KeyCommandModule getInstance() {
    return instance;
  }

  private void addKeyCommand(String input, Integer modifierFlags) {
    KeyCommands customCommand = new KeyCommands();
    customCommand.setInput(input);
    customCommand.setModifierFlags(modifierFlags);
    commands.add(customCommand);
  }

  private void removeKeyCommand(String input, Integer modifierFlags) {
    for (KeyCommands customCommand : commands) {
      if (customCommand.getInput().equals(input) && customCommand.getModifierFlags() == modifierFlags) {
        commands.remove(customCommand);
      }
    }
  }

  private boolean matchesInput(int keyCode, KeyEvent keyEvent) {
    for (KeyCommands customCommand : commands) {
      String pressedKey = Character.toString((char) keyEvent.getUnicodeChar());
      if (customCommand.getInput().equals(pressedKey.toLowerCase(Locale.ROOT)) && customCommand.getModifierFlags() == keyEvent.getModifiers()) {
        return true;
      }
    }

    return false;
  }

  public void onKeyDownEvent(int keyCode, KeyEvent keyEvent) {
    if (!reactContext.hasActiveCatalystInstance()) {
      return;
    }

    if (mJSModule == null) {
      mJSModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }


    if (matchesInput(keyCode, keyEvent)) {
      mJSModule.emit("onKeyCommand", getJsEventParams(keyCode, keyEvent, null));
    }
  };

  public void onKeyUpEvent(int keyCode, KeyEvent keyEvent) {
    if (!reactContext.hasActiveCatalystInstance()) {
      return;
    }

    if (mJSModule == null) {
      mJSModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }

    if (matchesInput(keyCode, keyEvent)) {
      mJSModule.emit("onKeyCommand", getJsEventParams(keyCode, keyEvent, null));
    }
  };

  public void onKeyMultipleEvent(int keyCode, int repeatCount, KeyEvent keyEvent) {
    if (!reactContext.hasActiveCatalystInstance()) {
      return;
    }

    if (mJSModule == null) {
      mJSModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }

    if (matchesInput(keyCode, keyEvent)) {
      mJSModule.emit("onKeyCommand", getJsEventParams(keyCode, keyEvent, null));
    }
  };

  private WritableMap getJsEventParams(int keyCode, KeyEvent keyEvent, Integer repeatCount) {
    WritableMap params = new WritableNativeMap();
    int action = keyEvent.getAction();
    int modifiers = keyEvent.getModifiers();
    char pressedKey = (char) keyEvent.getUnicodeChar();

    if (keyEvent.getAction() == KeyEvent.ACTION_MULTIPLE && keyCode == KeyEvent.KEYCODE_UNKNOWN) {
      String chars = keyEvent.getCharacters();
      if (chars != null) {
        params.putString("characters", chars);
      }
    }

    if (repeatCount != null) {
      params.putInt("repeatcount", repeatCount);
    }

    params.putInt("modifierFlags", modifiers);
    params.putString("input", String.valueOf(pressedKey));

    return params;
  }


  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("keyModifierCapsLock", KeyEvent.KEYCODE_CAPS_LOCK);
    constants.put("keyModifierShift", KeyEvent.KEYCODE_ENVELOPE);
    constants.put("keyModifierControl", null);
    constants.put("keyModifierOption", null);
    constants.put("keyModifierCommand", KeyEvent.META_CTRL_LEFT_ON);
    constants.put("keyModifierControlOption", null);
    constants.put("keyModifierControlOptionCommand", null);
    constants.put("keyModifierControlCommand", null);
    constants.put("keyModifierOptionCommand", null);
    constants.put("keyModifierShiftCommand", null);
    constants.put("keyModifierNumericPad", null);
    constants.put("keyInputUpArrow", null);
    constants.put("keyInputDownArrow", null);
    constants.put("keyInputLeftArrow", null);
    constants.put("keyInputRightArrow", null);
    constants.put("keyInputEscape", null);
    return constants;
  }

  @ReactMethod
  public void registerKeyCommand(ReadableArray json, Promise promise) {
    for (int i = 0; i < json.size(); i++) {
      addKeyCommand(json.getMap(i).getString("input"), json.getMap(i).getInt("modifierFlags"));
    }

    promise.resolve(null);
  }

  @ReactMethod
  public void unregisterKeyCommand(ReadableArray json, Promise promise) {
    for (int i = 0; i < json.size(); i++) {
      removeKeyCommand(json.getMap(i).getString("input"), json.getMap(i).getInt("modifierFlags"));
    }
    
    promise.resolve(null);
  }
}
