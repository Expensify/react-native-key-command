#import <Foundation/Foundation.h>
#import "HardwareShortcut.h"

@implementation HardwareShortcut

- (instancetype)init:(NSString *)input modifierFlags:(UIKeyModifierFlags)modifierFlags block:(void (^)(UIKeyCommand *))block
{
  if ((self = [super init])) {
    _input = input;
    _modifierFlags = modifierFlags;
    _block = block;
  }
  return self;
}

- (id)copyWithZone:(__unused NSZone *)zone
{
  return self;
}

- (BOOL)matchesInput:(NSString *)input modifierFlags:(UIKeyModifierFlags)modifierFlags
{
  return _input == input && _modifierFlags == modifierFlags;
}

- (BOOL)matchesInput:(UIKeyCommand *)keyCommand
{
  return _input == keyCommand.input && _modifierFlags == keyCommand.modifierFlags;
}

@end
