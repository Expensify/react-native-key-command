#ifndef HardwareShortcut_h
#define HardwareShortcut_h

#include <UIKit/UIKit.h>

@interface HardwareShortcut : NSObject <NSCopying>

- (instancetype)init:(NSString *)input modifierFlags:(UIKeyModifierFlags)modifierFlags block:(void (^)(UIKeyCommand *))block;

- (BOOL)matchesInput:(NSString *)input modifierFlags:(UIKeyModifierFlags)modifierFlags;
- (BOOL)matchesInput:(UIKeyCommand *)keyCommand;

@property (nonatomic, copy, readonly) NSString *input;
@property (nonatomic, readonly) UIKeyModifierFlags modifierFlags;
@property (nonatomic, copy) void (^block)(UIKeyCommand *);

@end

#endif /* HardwareShortcut_h */
