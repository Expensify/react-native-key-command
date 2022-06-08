package com.example.reactnativekeycommand;

import com.facebook.react.ReactActivity;
import android.view.KeyEvent;
import com.reactnativekeycommand.KeyCommandModule;

public class MainActivity extends ReactActivity {
  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    KeyCommandModule.getInstance().onKeyDownEvent(keyCode, event);
    return super.onKeyDown(keyCode, event);
  }

  @Override
  public boolean onKeyMultiple(int keyCode, int repeatCount, KeyEvent event) {
    KeyCommandModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event);
    return super.onKeyMultiple(keyCode, repeatCount, event);
  }

  @Override
  public boolean onKeyUp(int keyCode, KeyEvent event) {
    KeyCommandModule.getInstance().onKeyUpEvent(keyCode, event);
    return super.onKeyUp(keyCode, event);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "KeyCommandExample";
  }
}
