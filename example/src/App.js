import * as React from 'react';
import {
    // eslint-disable-next-line no-restricted-imports
    SafeAreaView, StyleSheet, ScrollView, Text,
} from 'react-native';
import * as KeyCommand from 'react-native-key-command';
import _ from 'underscore';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        padding: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    scroll: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
});

export default function App() {
    const [history, setHistory] = React.useState([]);

    const handleSearchCommandPress = React.useCallback((response) => {
        setHistory(state => state.concat(response));
    }, []);

    React.useEffect(() => {
        const SEARCH_COMMAND = {input: 'f', modifierFlags: KeyCommand.constants.keyModifierCommand};
        return KeyCommand.addListener(SEARCH_COMMAND, handleSearchCommandPress);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Press [CMD + F] to trigger keycommand events</Text>

            <ScrollView style={styles.scroll}>
                {_.map(history, (response, index) => (
                    <Text key={index}>{JSON.stringify(response, null, 2)}</Text>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

