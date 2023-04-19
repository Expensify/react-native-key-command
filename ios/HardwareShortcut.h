#ifndef HardwareShortcut_h
#define HardwareShortcut_h

#include <UIKit/UIKit.h>

@interface HardwareShortcut : NSObject <NSCopying>

- (instancetype)init:(NSString *)key flags:(UIKeyModifierFlags)flags block:(void (^)(UIKeyCommand *))block;

- (BOOL)matchesInput:(NSString *)input flags:(UIKeyModifierFlags)flags;
- (BOOL)matchesInput:(UIKeyCommand *)keyCommand;

@property (nonatomic, copy, readonly) NSString *key;
@property (nonatomic, readonly) UIKeyModifierFlags flags;
@property (nonatomic, copy) void (^block)(UIKeyCommand *);

@end

#endif /* HardwareShortcut_h */
