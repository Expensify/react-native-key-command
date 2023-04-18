#import <Foundation/Foundation.h>
#import "HardwareShortcut.h"

@implementation HardwareShortcut

- (instancetype)init:(NSString *)key flags:(UIKeyModifierFlags)flags block:(void (^)(UIKeyCommand *))block
{
  if ((self = [super init])) {
    _key = key;
    _flags = flags;
    _block = block;
  }
  return self;
}

- (id)copyWithZone:(__unused NSZone *)zone
{
  return self;
}

@end
