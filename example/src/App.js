import * as React from 'react';
import {View} from 'react-native';
import {multiply} from 'react-native-key-command';

export default function App() {
    React.useEffect(() => {
        multiply(3, 7);
    }, []);

    return (
        <View />
    );
}

