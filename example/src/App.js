import * as React from 'react';
import {
    registerKeyCommand, unregisterKeyCommand, constants, eventEmitter,
} from 'react-native-key-command';

export default function App() {
    React.useEffect(() => {
        const searchCommandId = {input: 'd', modifierFlags: constants.keyModifierCommand};

        registerKeyCommand([
            {input: 'd', modifierFlags: constants.keyModifierCommand},
        ]);

        return () => {
            unregisterKeyCommand([searchCommandId]);
        };
    }, []);

    React.useEffect(() => {
        const subscription = eventEmitter.addListener('onKeyCommand', console.log);
        return () => {
            subscription.remove();
        };
    }, []);

    return null;
}

