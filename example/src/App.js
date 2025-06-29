import * as React from 'react';
import {
    SafeAreaView, StyleSheet, ScrollView, Text, View,
} from 'react-native';
import * as KeyCommand from 'react-native-key-command';
import _ from 'underscore';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1e3799',
        flex: 1,
    },
    header: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 6,
    },
    scroll: {
        backgroundColor: '#fff',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    item: {
        marginBottom: 6,
    },
});

export default function App() {
    const [history, setHistory] = React.useState([]);

    const handleSearchCommandPress = React.useCallback((response) => {
        setHistory(state => state.concat(response));
    }, []);

    React.useEffect(() => {
        const KEY_COMMAND = {input: 'f', modifierFlags: KeyCommand.constants.keyModifierCommand};
        return KeyCommand.addListener(KEY_COMMAND, () => handleSearchCommandPress('[CMD + F] pressed'));
    }, []);

    React.useEffect(() => {
        const KEY_COMMAND = {input: KeyCommand.constants.keyInputEscape, modifierFlags: KeyCommand.constants.keyModifierShift};
        return KeyCommand.addListener(KEY_COMMAND, () => handleSearchCommandPress('[Shift + Esc] pressed'));
    }, []);

    React.useEffect(() => {
        const KEY_COMMAND = {input: KeyCommand.constants.keyInputEscape};
        return KeyCommand.addListener(KEY_COMMAND, () => handleSearchCommandPress('[Esc] pressed'));
    }, []);

    React.useEffect(() => {
        const KEY_COMMAND = {input: 'g'};
        return KeyCommand.addListener(KEY_COMMAND, () => handleSearchCommandPress('[G] pressed'));
    }, []);

    React.useEffect(() => {
        const KEY_COMMAND = {input: 'k', modifierFlags: KeyCommand.constants.keyModifierShiftCommand};
        return KeyCommand.addListener(KEY_COMMAND, () => handleSearchCommandPress('[CMD + SHIFT + K] pressed'));
    }, []);

    React.useEffect(() => {
        const KEY_COMMAND = {input: KeyCommand.constants.keyInputEnter};
        return KeyCommand.addListener(KEY_COMMAND, () => handleSearchCommandPress('[Enter] pressed'));
    }, []);

    React.useEffect(() => {
        const KEY_COMMAND = {input: KeyCommand.constants.keyInputDownArrow};
        return KeyCommand.addListener(KEY_COMMAND, () => handleSearchCommandPress('[Down arrow] pressed'));
    }, []);

    React.useEffect(() => {
        const KEY_COMMAND = {input: KeyCommand.constants.keyInputUpArrow};
        return KeyCommand.addListener(KEY_COMMAND, () => handleSearchCommandPress('[Up arrow] pressed'));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Registered key commands:</Text>
                <Text style={styles.title}>1. [CMD + F]</Text>
                <Text style={styles.title}>2. [G]</Text>
                <Text style={styles.title}>3. [Esc]</Text>
                <Text style={styles.title}>4. [Shift + Esc]</Text>
                <Text style={styles.title}>5. [CMD + SHIFT + K]</Text>
                <Text style={styles.title}>6. [ENTER]</Text>
                <Text style={styles.title}>7. [DOWN / UP ARROW]</Text>
            </View>

            <ScrollView style={styles.scroll}>
                {_.map(history, (response, index) => (
                    <Text key={index} style={styles.item}>{response}</Text>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

