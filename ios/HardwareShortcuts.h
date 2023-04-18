#ifndef Shortcuts_h
#define Shortcuts_h

#include <UIKit/UIKit.h>

@interface HardwareKeyCommand : NSObject <NSCopying>

@property (nonatomic, copy, readonly) NSString *key;
@property (nonatomic, readonly) UIKeyModifierFlags flags;
@property (nonatomic, copy) void (^block)(UIKeyCommand *);

@end


@interface HardwareShortcuts : NSObject

+ (instancetype)sharedInstance;
- (NSArray *)keyCommands;
- (void)handleKeyCommand:(UIKeyCommand *)keyCommand;
- (void)registerKeyCommand;
- (void)unregisterKeyCommand;

@property (nonatomic, strong) NSMutableSet<HardwareKeyCommand *> *commands;

@end

#endif
