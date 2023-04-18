#ifndef Shortcuts_h
#define Shortcuts_h

#include <UIKit/UIKit.h>
#include "HardwareShortcut.h"

@interface HardwareShortcuts : NSObject

+ (instancetype)sharedInstance;
- (NSArray *)keyCommands;
- (void)handleKeyCommand:(UIKeyCommand *)keyCommand;
- (void)registerKeyCommand:(NSString *)input
             modifierFlags:(UIKeyModifierFlags)flags
                    action:(void (^)(UIKeyCommand *))block;
- (void)unregisterKeyCommand;

@property (nonatomic, strong) NSMutableSet<HardwareShortcut *> *commands;

@end

#endif
