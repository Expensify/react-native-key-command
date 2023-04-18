#ifndef HardwareShortcut_h
#define HardwareShortcut_h

#include <UIKit/UIKit.h>

@interface HardwareShortcut : NSObject <NSCopying>

- (instancetype)init:(NSString *)key flags:(UIKeyModifierFlags)flags block:(void (^)(UIKeyCommand *))block;

@property (nonatomic, copy, readonly) NSString *key;
@property (nonatomic, readonly) UIKeyModifierFlags flags;
@property (nonatomic, copy) void (^block)(UIKeyCommand *);

@end

#endif /* HardwareShortcut_h */
