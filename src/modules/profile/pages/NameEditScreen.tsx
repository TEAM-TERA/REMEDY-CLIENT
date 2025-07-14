import React, { useState } from 'react';
import {
    StatusBar,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import nameEditScreen from '../styles/nameEditScreen';
import Header from '../components/Header';

function NameEditScreen() {
    const [userName, setUserName] = useState('User_1');

    return (
        <SafeAreaView style={nameEditScreen.safeAreaView}>
            <StatusBar translucent={false} />

            <View style={nameEditScreen.container}>
                <Header title="이름 수정" />

                <View style={nameEditScreen.nameEditContainer}>
                    <Text style={nameEditScreen.title}>이름</Text>
                    <TextInput
                        style={nameEditScreen.nameEditInput}
                        value={userName}
                        onChangeText={setUserName}
                    />
                </View>

                <TouchableOpacity style={nameEditScreen.button}>
                    <Text style={nameEditScreen.buttonText}>수정하기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default NameEditScreen;
