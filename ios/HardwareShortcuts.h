#ifndef Shortcuts_h
#define Shortcuts_h

#include <UIKit/UIKit.h>
#include "HardwareShortcut.h"

@interface HardwareShortcuts : NSObject

+ (instancetype)sharedInstance;

- (NSArray *)keyCommands;

- (void)handleKeyCommand:(UIKeyCommand *)keyCommand;

- (void)registerKeyCommand:(NSString *)input
             modifierFlags:(UIKeyModifierFlags)modifierFlags
                    action:(void (^)(UIKeyCommand *))block;

- (void)unregisterKeyCommand:(NSString *)input modifierFlags:(UIKeyModifierFlags)modifierFlags;

@property (nonatomic, strong) NSMutableSet<HardwareShortcut *> *commands;

@end

#endif
