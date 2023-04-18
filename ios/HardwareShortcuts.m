#import "HardwareShortcuts.h"

@implementation HardwareKeyCommand

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

@implementation HardwareShortcuts

- (instancetype)init
{
  if ((self = [super init])) {
    _commands = [NSMutableSet new];
  }
  return self;
}

+ (instancetype)sharedInstance
{
  static HardwareShortcuts *sharedInstance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [self new];
  });

  return sharedInstance;
}

+ (void)initialize
{
  
}

- (NSArray *)keyCommands {
  NSMutableArray *commands = [NSMutableArray array];

  [[_commands allObjects] enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
    id command = [UIKeyCommand keyCommandWithInput:[obj key]
                                     modifierFlags:[obj flags]
                                            action:@selector(handleKeyCommand:)];
    [commands addObject:command];
  }];

  return commands;
}

- (void)handleKeyCommand:(UIKeyCommand *)keyCommand {
  [[_commands allObjects] enumerateObjectsUsingBlock:^(HardwareKeyCommand* obj, NSUInteger idx, BOOL *stop) {
    if ([obj key] == keyCommand.input && [obj flags] == keyCommand.modifierFlags) {
      obj.block(keyCommand);
    }
  }];
}

- (void)registerKeyCommand:(NSString *)input
             modifierFlags:(UIKeyModifierFlags)flags
                    action:(void (^)(UIKeyCommand *))block
{
  HardwareKeyCommand *keyCommand = [[HardwareKeyCommand alloc] init:input flags:flags block:block];
  [_commands removeObject:keyCommand];
  [_commands addObject:keyCommand];
}

- (void)unregisterKeyCommand {
}

@end
