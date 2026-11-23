#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <HardwareShortcuts.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  self.moduleName = @"main";
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSArray *)keyCommands {
  return [HardwareShortcuts sharedInstance].keyCommands;
}

- (void)handleKeyCommand:(UIKeyCommand *)keyCommand {
  [[HardwareShortcuts sharedInstance] handleKeyCommand:keyCommand];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)concurrentRootEnabled {
  return YES;
}

@end
