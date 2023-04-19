#import "KeyCommand.h"

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

+ (id)allocWithZone:(NSZone *)zone {
    static KeyCommand *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

+ (RCTCallableJSModules *)sharedJsModule {
    static RCTCallableJSModules *sharedJsModule = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      sharedJsModule = [RCTCallableJSModules new];
    });
    return sharedJsModule;
}

- (void)stopObserving
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[HardwareShortcuts sharedInstance] resetKeyCommands];
  });
}

RCT_REMAP_METHOD(registerKeyCommands,
                 registerKeyCommands:(NSArray *)json
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
  NSArray<NSDictionary *> *commandsArray = json;

  for (NSDictionary *commandJSON in commandsArray) {
    NSString *input = commandJSON[@"input"];
    NSNumber *modifierFlags = commandJSON[@"modifierFlags"];

    if (!modifierFlags) {
      modifierFlags = @0;
    }

    id action = ^(__unused UIKeyCommand *command) {
      dispatch_async(dispatch_get_main_queue(), ^{
        id body = @{
          @"input": [command.input lowercaseString],
          @"modifierFlags": [NSNumber numberWithInteger:command.modifierFlags]
        };
        [self sendEventWithName:@"onKeyCommand" body:body];
      });
    };
    
    dispatch_async(dispatch_get_main_queue(), ^{
      [[HardwareShortcuts sharedInstance]
        registerKeyCommand:input
        modifierFlags:[modifierFlags integerValue]
        action:action];
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
    NSNumber *modifierFlags = commandJSON[@"modifierFlags"];

    if (!modifierFlags) {
      modifierFlags = @0;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
      [[HardwareShortcuts sharedInstance]
        unregisterKeyCommand:input
        modifierFlags:[modifierFlags integerValue]
      ];
    });
  }

  resolve(nil);
}

@end
