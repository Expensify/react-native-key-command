#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <UIKit/UIKit.h>
#import "HardwareShortcuts.h"

extern NSDictionary *ModifierFlagsConstants;

NSDictionary *ModifierFlagsConstants = @{
  @"keyModifierCapsLock": @(UIKeyModifierAlphaShift),
  @"keyModifierShift": @(UIKeyModifierShift),
  @"keyModifierControl": @(UIKeyModifierControl),
  @"keyModifierOption": @(UIKeyModifierAlternate),
  @"keyModifierCommand": @(UIKeyModifierCommand),

  @"keyModifierControlOption": @(UIKeyModifierControl | UIKeyModifierAlternate),
  @"keyModifierControlOptionCommand": @(UIKeyModifierControl | UIKeyModifierAlternate | UIKeyModifierCommand),
  @"keyModifierControlCommand": @(UIKeyModifierControl | UIKeyModifierCommand),
  @"keyModifierOptionCommand": @(UIKeyModifierAlternate | UIKeyModifierCommand),
  @"keyModifierShiftCommand": @(UIKeyModifierShift | UIKeyModifierCommand),
  @"keyModifierNumericPad": @(UIKeyModifierNumericPad),
  
  @"keyInputUpArrow": UIKeyInputUpArrow,
  @"keyInputDownArrow": UIKeyInputDownArrow,
  @"keyInputLeftArrow": UIKeyInputLeftArrow,
  @"keyInputRightArrow": UIKeyInputRightArrow,
  @"keyInputEscape": UIKeyInputEscape,
  @"keyInputEnter": @40
};

@interface KeyCommand : RCTEventEmitter <RCTBridgeModule>

@end
