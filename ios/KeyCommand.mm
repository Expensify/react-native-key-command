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
    NSNumber *flags = commandJSON[@"modifierFlags"];

    if (!flags) {
        flags = @0;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
      [[HardwareShortcuts sharedInstance]
          registerKeyCommand:input
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
  [[HardwareShortcuts sharedInstance] unregisterKeyCommand];
  resolve(nil);
}

@end
