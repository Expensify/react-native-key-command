#import "KeyCommand.h"
#import <UIKit/UIKit.h>
#import <objc/message.h>
#import <objc/runtime.h>
#import "RCTDefines.h"
#import "RCTUtils.h"

NSDictionary *ModifierFlagsConstants = @{
  @"keyModifierCapsLock": @(UIKeyModifierAlphaShift),
  @"keyModifierShift": @(UIKeyModifierShift),
  @"keyModifierControl": @(UIKeyModifierControl),
  @"keyModifierOption": @(UIKeyModifierAlternate),
  @"keyModifierCommand": @(UIKeyModifierCommand),

  @"keyModifierControlOption": @(UIKeyModifierControl | UIKeyModifierAlternate),
  @"keyModifierControlOptionCommand": @(UIKeyModifierControl | UIKeyModifierAlternate | UIKeyModifierCommand),
  @"keyModifierControlCommand": @(UIKeyModifierControl | UIKeyModifierCommand),
  @"keyModifierOptionCommand": @(UIKeyModifierAlternate | UIKeyModifierCommand),
  @"keyModifierShiftCommand": @(UIKeyModifierShift | UIKeyModifierCommand),
  @"keyModifierNumericPad": @(UIKeyModifierNumericPad),
  
  @"keyInputUpArrow": UIKeyInputUpArrow,
  @"keyInputDownArrow": UIKeyInputDownArrow,
  @"keyInputLeftArrow": UIKeyInputLeftArrow,
  @"keyInputRightArrow": UIKeyInputRightArrow,
  @"keyInputEscape": UIKeyInputEscape
};

@interface UIEvent (UIPhysicalKeyboardEvent)

@property (nonatomic) NSString *_modifiedInput;
@property (nonatomic) NSString *_unmodifiedInput;
@property (nonatomic) UIKeyModifierFlags _modifierFlags;
@property (nonatomic) BOOL _isKeyDown;
@property (nonatomic) long _keyCode;

@end

@interface HardwareKeyCommand : NSObject <NSCopying>

@property (nonatomic, copy, readonly) NSString *key;
@property (nonatomic, readonly) UIKeyModifierFlags flags;
@property (nonatomic, copy) void (^block)(UIKeyCommand *);

@end

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

RCT_NOT_IMPLEMENTED(-(instancetype)init)

- (id)copyWithZone:(__unused NSZone *)zone
{
  return self;
}

- (NSUInteger)hash
{
  return _key.hash ^ _flags;
}

- (BOOL)isEqual:(HardwareKeyCommand *)object
{
  if (![object isKindOfClass:[HardwareKeyCommand class]]) {
    return NO;
  }
  return [self matchesInput:object.key flags:object.flags];
}

- (BOOL)matchesInput:(NSString *)input flags:(UIKeyModifierFlags)flags
{
  if (
    [input isEqualToString:UIKeyInputEscape] &&
    [_key isEqualToString:UIKeyInputEscape]
  ) {
    return true;
  }
  
  if (
    [input isEqualToString:UIKeyInputUpArrow] &&
    [_key isEqualToString:UIKeyInputUpArrow]
  ) {
    return true;
  }
  
  if (
    [input isEqualToString:UIKeyInputLeftArrow] &&
    [_key isEqualToString:UIKeyInputLeftArrow]
  ) {
    return true;
  }
  
  if (
    [input isEqualToString:UIKeyInputRightArrow] &&
    [_key isEqualToString:UIKeyInputRightArrow]
  ) {
    return true;
  }
  
  return [_key isEqual:[input lowercaseString]] && _flags == flags;
}

- (NSString *)description
{
  return [NSString stringWithFormat:@"<%@:%p input=\"%@\" flags=%lld hasBlock=%@>",
                                    [self class],
                                    self,
                                    _key,
                                    (long long)_flags,
                                    _block ? @"YES" : @"NO"];
}

@end

@interface HardwareKeyCommands ()

@property (nonatomic, strong) NSMutableSet<HardwareKeyCommand *> *commands;

@end

@implementation HardwareKeyCommands

- (instancetype)init
{
  if ((self = [super init])) {
    _commands = [NSMutableSet new];
  }
  return self;
}

+ (instancetype)sharedInstance
{
  static HardwareKeyCommands *sharedInstance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [self new];
  });

  return sharedInstance;
}

+ (void)initialize
{
  SEL originalKeyEventSelector = NSSelectorFromString(@"handleKeyUIEvent:");
  SEL swizzledKeyEventSelector = NSSelectorFromString(
      [NSString stringWithFormat:@"_rct_swizzle_%x_%@", arc4random(), NSStringFromSelector(originalKeyEventSelector)]);

  void (^handleKeyUIEventSwizzleBlock)(UIApplication *, UIEvent *) = ^(UIApplication *slf, UIEvent *event) {
    [[[self class] sharedInstance] handleKeyUIEventSwizzle:event];

    ((void (*)(id, SEL, id))objc_msgSend)(slf, swizzledKeyEventSelector, event);
  };

  RCTSwapInstanceMethodWithBlock(
      [UIApplication class], originalKeyEventSelector, handleKeyUIEventSwizzleBlock, swizzledKeyEventSelector);
}

- (void)handleKeyUIEventSwizzle:(UIEvent *)event
{
  NSString *unmodifiedInput = nil;
  NSString *modifiedInput = nil;
  UIKeyModifierFlags modifierFlags = 0;
  BOOL isKeyDown = NO;
  long keyCode = 0;

  if ([event respondsToSelector:@selector(_unmodifiedInput)]) {
    unmodifiedInput = [event _unmodifiedInput];
  }

  if ([event respondsToSelector:@selector(_modifiedInput)]) {
    modifiedInput = [event _modifiedInput];
  }

  if ([event respondsToSelector:@selector(_modifierFlags)]) {
    modifierFlags = [event _modifierFlags];
  }

  if ([event respondsToSelector:@selector(_isKeyDown)]) {
    isKeyDown = [event _isKeyDown];
  }

  if ([event respondsToSelector:@selector(_keyCode)]) {
    keyCode = [event _keyCode];
  }

  BOOL interactionEnabled = !UIApplication.sharedApplication.isIgnoringInteractionEvents;
  BOOL hasFirstResponder = NO;
  
  if (isKeyDown && interactionEnabled) {
    UIResponder *firstResponder = nil;
    for (UIWindow *window in [self allWindows]) {
      firstResponder = [window valueForKey:@"firstResponder"];
      if (firstResponder) {
        hasFirstResponder = YES;
        break;
      }
    }

    // Ignore key commands (except escape) when there's an active responder
    if (!firstResponder) {
      [self RCT_handleKeyCommand:unmodifiedInput flags:modifierFlags];
    }
  }
};

- (NSArray<UIWindow *> *)allWindows
{
  BOOL includeInternalWindows = YES;
  BOOL onlyVisibleWindows = NO;

  // Obfuscating selector allWindowsIncludingInternalWindows:onlyVisibleWindows:
  NSArray<NSString *> *allWindowsComponents =
      @[ @"al", @"lWindo", @"wsIncl", @"udingInt", @"ernalWin", @"dows:o", @"nlyVisi", @"bleWin", @"dows:" ];
  SEL allWindowsSelector = NSSelectorFromString([allWindowsComponents componentsJoinedByString:@""]);

  NSMethodSignature *methodSignature = [[UIWindow class] methodSignatureForSelector:allWindowsSelector];
  NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:methodSignature];

  invocation.target = [UIWindow class];
  invocation.selector = allWindowsSelector;
  [invocation setArgument:&includeInternalWindows atIndex:2];
  [invocation setArgument:&onlyVisibleWindows atIndex:3];
  [invocation invoke];

  __unsafe_unretained NSArray<UIWindow *> *windows = nil;
  [invocation getReturnValue:&windows];
  return windows;
}

+ (instancetype)voidCompletionBlock
{
  return nil;
}

- (void)RCT_handleKeyCommand:(NSString *)input flags:(UIKeyModifierFlags)modifierFlags
{
  for (HardwareKeyCommand *command in [HardwareKeyCommands sharedInstance].commands) {
    if ([command matchesInput:input flags:modifierFlags]) {
      if (command.block) {
        UIKeyCommand *keycommand = [UIKeyCommand keyCommandWithInput:input modifierFlags:modifierFlags action:@selector(voidCompletionBlock:)];
        command.block(keycommand);
      }
    }
  }
}

- (void)registerKeyCommandWithInput:(NSString *)input
                      modifierFlags:(UIKeyModifierFlags)flags
                             action:(void (^)(UIKeyCommand *))block
{
  RCTAssertMainQueue();

  HardwareKeyCommand *keyCommand = [[HardwareKeyCommand alloc] init:input flags:flags block:block];
  [_commands removeObject:keyCommand];
  [_commands addObject:keyCommand];
}

- (void)unregisterKeyCommandWithInput:(NSString *)input modifierFlags:(UIKeyModifierFlags)flags
{
  RCTAssertMainQueue();

  for (HardwareKeyCommand *command in _commands.allObjects) {
    if ([command matchesInput:input flags:flags]) {
      [_commands removeObject:command];
      break;
    }
  }
}

- (BOOL)isKeyCommandRegisteredForInput:(NSString *)input modifierFlags:(UIKeyModifierFlags)flags
{
  RCTAssertMainQueue();

  for (HardwareKeyCommand *command in _commands) {
    if ([command matchesInput:input flags:flags]) {
      return YES;
    }
  }
  return NO;
}

@end



@implementation KeyCommand

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onKeyCommand"];
}

- (NSDictionary *)constantsToExport {
    return ModifierFlagsConstants;
}

RCT_REMAP_METHOD(registerKeyCommands,
                 registerKeyCommands:(NSArray *)json
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{

  NSArray<NSDictionary *> *commandsArray = json;

  for (NSDictionary *commandJSON in commandsArray) {
      NSString *input = commandJSON[@"input"];
      NSNumber *flags = commandJSON[@"modifierFlags"];

      if (!flags) {
          flags = @0;
      }

      dispatch_async(dispatch_get_main_queue(), ^{
        [[HardwareKeyCommands sharedInstance]
            registerKeyCommandWithInput:input
            modifierFlags:[flags integerValue]
            action:^(__unused UIKeyCommand *command) {
              [self sendEventWithName:@"onKeyCommand" body:@{
                 @"input": [command.input lowercaseString],
                 @"modifierFlags": [NSNumber numberWithInteger:command.modifierFlags]
              }];
            }];
      });
  }

  resolve(nil);
}

RCT_REMAP_METHOD(unregisterKeyCommands,
                 unregisterKeyCommands:(NSArray *)json
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{

  NSArray<NSDictionary *> *commandsArray = json;

  for (NSDictionary *commandJSON in commandsArray) {
      NSString *input = commandJSON[@"input"];
      NSNumber *flags = commandJSON[@"modifierFlags"];

      if (!flags) {
          flags = @0;
      }

      dispatch_async(dispatch_get_main_queue(), ^{
        [[HardwareKeyCommands sharedInstance]
            unregisterKeyCommandWithInput:input
            modifierFlags:[flags integerValue]
        ];
      });
  }

  resolve(nil);
}

@end
