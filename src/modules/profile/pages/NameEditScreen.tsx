import React, { useState } from 'react';
import {
    StatusBar,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import nameEditScreen from '../styles/NameEditScreen';
import { NameEditScreenProps } from '../types/NameEditScreen';
import Header from '../components/Header';

function NameEditScreen({ initialUserName = '' }: NameEditScreenProps) {
    const [userName, setUserName] = useState(initialUserName);

    const handleSave = () => {
        // 이름 수정 로직 구현
        console.log('새 이름:', userName);
        // API 호출 또는 상태 업데이트
    };

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

                <TouchableOpacity
                    style={nameEditScreen.button}
                    onPress={handleSave}
                >
                    <Text style={nameEditScreen.buttonText}>수정하기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default NameEditScreen;
