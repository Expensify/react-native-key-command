#import "HardwareShortcuts.h"
#import "RCTUtils.h"

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

- (NSArray *)keyCommands {
  NSMutableArray *commands = [NSMutableArray array];

  [[_commands allObjects] enumerateObjectsUsingBlock:^(HardwareShortcut* hardwareShortcut, NSUInteger idx, BOOL *stop) {
    id command = [UIKeyCommand keyCommandWithInput:[hardwareShortcut input]
                                     modifierFlags:[hardwareShortcut modifierFlags]
                                            action:@selector(handleKeyCommand:)];
    [commands addObject:command];
  }];

  return commands;
}

- (void)handleKeyCommand:(UIKeyCommand *)keyCommand {
  RCTAssertMainQueue();

  [[_commands allObjects] enumerateObjectsUsingBlock:^(HardwareShortcut* hardwareShortcut, NSUInteger idx, BOOL *stop) {
    if ([hardwareShortcut matchesInput:keyCommand]) {
      hardwareShortcut.block(keyCommand);
    }
  }];
}

- (void)registerKeyCommand:(NSString *)input
             modifierFlags:(UIKeyModifierFlags)modifierFlags
                    action:(void (^)(UIKeyCommand *))block
{
  RCTAssertMainQueue();

  HardwareShortcut *keyCommand = [[HardwareShortcut alloc] init:input modifierFlags:modifierFlags block:block];
  [_commands removeObject:keyCommand];
  [_commands addObject:keyCommand];
}

- (void)unregisterKeyCommand:(NSString *)input modifierFlags:(UIKeyModifierFlags)modifierFlags {
  RCTAssertMainQueue();

  [[_commands allObjects] enumerateObjectsUsingBlock:^(HardwareShortcut* hardwareShortcut, NSUInteger idx, BOOL *stop) {
    if ([hardwareShortcut matchesInput:input modifierFlags:modifierFlags]) {
      [_commands removeObject:hardwareShortcut];
    }
  }];
}

- (void)resetKeyCommands {
  RCTAssertMainQueue();

  [[_commands allObjects] enumerateObjectsUsingBlock:^(HardwareShortcut* hardwareShortcut, NSUInteger idx, BOOL *stop) {
    [_commands removeObject:hardwareShortcut];
  }];
}

@end
