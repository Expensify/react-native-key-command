package com.expensify.reactnativekeycommand;

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

import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.HashMap;

@ReactModule(name = KeyCommandModule.NAME)
public class KeyCommandModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext = null;
    private DeviceEventManagerModule.RCTDeviceEventEmitter mJSModule = null;
    private static KeyCommandModule instance = null;

    public static final String NAME = "KeyCommand";

    private static final Set<Set<Object>> commandsArray = new HashSet<Set<Object>>();

    public KeyCommandModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    public static KeyCommandModule init(ReactApplicationContext reactContext) {
        instance = new KeyCommandModule(reactContext);
        return instance;
    }

    public static KeyCommandModule getInstance() {
        return instance;
    }

    public void onKeyDownEvent(int keyCode, KeyEvent keyEvent) {
        if (!reactContext.hasActiveCatalystInstance()) {
            return;
        }

        if (mJSModule == null) {
            mJSModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }

        WritableMap params = getJsEventParams(keyCode, keyEvent, null);
        
        Set<Object> command = new HashSet<Object>();
        command.add(params.getString("input"));
        command.add(params.getInt("modifierFlags"));

        if (commandsArray.contains(command)) {
            mJSModule.emit("onKeyCommand", params);
        }
    };

    private WritableMap getJsEventParams(int keyCode, KeyEvent keyEvent, Integer repeatCount) {
        WritableMap params = new WritableNativeMap();
        int action = keyEvent.getAction();
        char pressedKey = (char) keyEvent.getUnicodeChar();

        params.putString("input", String.valueOf(keyEvent.getDisplayLabel()).toLowerCase());

        if (keyEvent.isCtrlPressed()) {
            params.putInt("modifierFlags", KeyEvent.META_CTRL_MASK);
        }
        else if (keyEvent.isAltPressed()) {
            params.putInt("modifierFlags", KeyEvent.META_ALT_MASK);
        }
        else if (keyEvent.isShiftPressed()) {
            params.putInt("modifierFlags", KeyEvent.META_SHIFT_MASK);
        } else {
            params.putInt("modifierFlags", keyEvent.getModifiers());
        }

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

        constants.put("keyModifierShift", KeyEvent.META_SHIFT_MASK);
        constants.put("keyModifierControl", KeyEvent.META_CTRL_MASK);
        constants.put("keyModifierAlternate", KeyEvent.META_ALT_MASK);
        constants.put("keyModifierCommand", KeyEvent.META_CTRL_MASK);
        constants.put("keyModifierNumericPad", KeyEvent.KEYCODE_NUM);
        constants.put("keyInputUpArrow", KeyEvent.KEYCODE_DPAD_UP);
        constants.put("keyInputDownArrow", KeyEvent.KEYCODE_DPAD_DOWN);
        constants.put("keyInputLeftArrow", KeyEvent.KEYCODE_DPAD_LEFT);
        constants.put("keyInputRightArrow", KeyEvent.KEYCODE_DPAD_RIGHT);
        constants.put("keyInputEscape", KeyEvent.KEYCODE_ESCAPE);

        return constants;
    }

    @ReactMethod
    public void registerKeyCommands(ReadableArray json, Promise promise) {
        for (int i = 0; i < json.size(); i++) {
            Set<Object> command = new HashSet<Object>();
            command.add(json.getMap(i).getString("input"));
            command.add(json.getMap(i).getInt("modifierFlags"));
            commandsArray.add(command);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void unregisterKeyCommands(ReadableArray json, Promise promise) {
        for (int i = 0; i < json.size(); i++) {
            Set<Object> command = new HashSet<Object>();
            command.add(json.getMap(i).getString("input"));
            command.add(json.getMap(i).getInt("modifierFlags"));
            commandsArray.remove(command);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void addListener(String eventName) {}

    @ReactMethod
    public void removeListeners(Integer count) {}
}
