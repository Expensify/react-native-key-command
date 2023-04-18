#import "HardwareShortcuts.h"

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
  return @[
    [UIKeyCommand keyCommandWithInput:@"\b" modifierFlags:0 action:@selector(handleKeyCommand:)],
    [UIKeyCommand keyCommandWithInput:@"a" modifierFlags:0 action:@selector(handleKeyCommand:)],
  ];
}

- (void)handleKeyCommand:(UIKeyCommand *)keyCommand {
  NSLog(@"inside: %@ was pressed", keyCommand.input);
}

- (void)registerKeyCommand {
  NSLog(@"inside: register");
}

- (void)unregisterKeyCommand {
  NSLog(@"inside: unregister");
}

@end
