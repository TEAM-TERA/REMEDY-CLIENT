import React, { useState } from 'react';
import {
    StatusBar,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/NameEditScreen';
import Header from '../components/Header';

function NameEditScreen() {
    const [userName, setUserName] = useState('User_1');

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <StatusBar translucent={false} />

            <View style={styles.container}>
                <Header title="이름 수정" />

                <View style={styles.nameEditContainer}>
                    <Text style={styles.title}>이름</Text>
                    <TextInput
                        style={styles.nameEditInput}
                        value={userName}
                        onChangeText={setUserName}
                    />
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>수정하기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default NameEditScreen;
