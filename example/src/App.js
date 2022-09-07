import * as React from 'react';
import * as KeyCommand from 'react-native-key-command';

export default function App() {
    React.useEffect(() => {
        const searchCommandId = {input: 'f', modifierFlags: KeyCommand.constants.keyModifierCommand};

        KeyCommand.registerKeyCommand([
            searchCommandId,
        ]);

        return () => {
            KeyCommand.unregisterKeyCommand([searchCommandId]);
        };
    }, []);

    React.useEffect(() => {
        const handleKeyCommand = () => {};
        const subscription = KeyCommand.eventEmitter.addListener('onKeyCommand', handleKeyCommand);
        return () => {
            subscription.remove();
        };
    }, []);

    return null;
}
