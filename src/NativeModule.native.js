import {NativeModules, Platform} from 'react-native';
import KeyCommandWeb from './KeyCommand.web';

const PLATFORM_ERROR_MESSAGE = Platform.select({ios: "- You have run 'pod install'\n", default: ''});
const LINKING_ERROR = `The package 'react-native-key-command' doesn't seem to be linked. Make sure: \n\n
${PLATFORM_ERROR_MESSAGE}\n
- You rebuilt the app after installing the package\n
- You are not using Expo managed workflow\n`;

const KeyCommand = (() => {
    if (NativeModules.KeyCommand) {
        return NativeModules.KeyCommand;
    }

    return new Proxy(
        {},
        {
            get() {
                throw new Error(LINKING_ERROR);
            },
        },
    );
})();

export default KeyCommand;
