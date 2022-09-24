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

    private static final Set<String> commandsArray = new HashSet<String>();

    public KeyCommandModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    public static KeyCommandModule initKeyCommandModule(ReactApplicationContext reactContext) {
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
        mJSModule.emit("onKeyCommand", getJsEventParams(keyCode, keyEvent, null));
    };

    public void onKeyUpEvent(int keyCode, KeyEvent keyEvent) {
        if (!reactContext.hasActiveCatalystInstance()) {
            return;
        }

        if (mJSModule == null) {
            mJSModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        mJSModule.emit("onKeyCommand", getJsEventParams(keyCode, keyEvent, null));
    };

    public void onKeyMultipleEvent(int keyCode, int repeatCount, KeyEvent keyEvent) {
        if (!reactContext.hasActiveCatalystInstance()) {
            return;
        }

        if (mJSModule == null) {
            mJSModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        mJSModule.emit("onKeyCommand", getJsEventParams(keyCode, keyEvent, repeatCount));
    };

    private WritableMap getJsEventParams(int keyCode, KeyEvent keyEvent, Integer repeatCount) {
        WritableMap params = new WritableNativeMap();
        int action = keyEvent.getAction();
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

        params.putInt("keyCode", keyCode);
        params.putInt("action", action);
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
        promise.resolve(null);
    }

    @ReactMethod
    public void unregisterKeyCommands(ReadableArray json, Promise promise) {
        promise.resolve(null);
    }
}
