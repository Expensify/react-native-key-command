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

      dispatch_async(dispatch_get_main_queue(), ^{
          [[HardwareShortcuts sharedInstance]
              registerKeyCommand:input
              modifierFlags:[modifierFlags integerValue]
              action:^(__unused UIKeyCommand *command) {
                id body = @{
                  @"input": [command.input lowercaseString],
                  @"modifierFlags": [NSNumber numberWithInteger:command.modifierFlags]
                };
                [self sendEventWithName:@"onKeyCommand" body:body];
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
