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
  [[HardwareShortcuts sharedInstance] registerKeyCommand];
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
