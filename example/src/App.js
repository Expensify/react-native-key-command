import * as React from 'react';
import {
    SafeAreaView, StyleSheet, ScrollView, Text, View,
} from 'react-native';
import * as KeyCommand from 'react-native-key-command';
import _ from 'underscore';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    header: {
        backgroundColor: '#1e3799',
        padding: 12,
    },
    title: {
        fontSize: 16,
        color: '#fff',
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
        const SEARCH_COMMAND = {input: 'f', modifierFlags: KeyCommand.constants.keyModifierShift};
        return KeyCommand.addListener(SEARCH_COMMAND, handleSearchCommandPress);
    }, []);

    React.useEffect(() => {
        const SEARCH_COMMAND = {input: KeyCommand.constants.keyInputEscape};
        return KeyCommand.addListener(SEARCH_COMMAND, handleSearchCommandPress);
    }, []);

    React.useEffect(() => {
        const SEARCH_COMMAND = {input: 'g'};
        return KeyCommand.addListener(SEARCH_COMMAND, handleSearchCommandPress);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Registered key commands:</Text>
                <Text style={styles.title}>1. [CMD + F]</Text>
                <Text style={styles.title}>2. [G]</Text>
                <Text style={styles.title}>3. [Esc]</Text>
            </View>

            <ScrollView style={styles.scroll}>
                {_.map(history, (response, index) => (
                    <Text key={index}>{JSON.stringify(response, null, 2)}</Text>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

