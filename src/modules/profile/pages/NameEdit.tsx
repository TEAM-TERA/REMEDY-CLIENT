import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../components/BackButton';
import commonStyles from '../style';

function NameEdit() {
  const [userName, setUserName] = useState('User_1');

  return (
    <SafeAreaView style={commonStyles.safeAreaView}>
      <StatusBar translucent={false} />

      <View style={commonStyles.container}>
        <View style={commonStyles.headerContainer}>
          <BackButton textStyle={commonStyles.backButton} />
          <Text style={commonStyles.title}>이름 수정</Text>
          <View />
        </View>

        <View style={commonStyles.nameEditContainer}>
          <Text style={commonStyles.title}>이름</Text>
          <TextInput
            style={commonStyles.nameEditInput}
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <View>
          <TouchableOpacity
            style={commonStyles.button}
            onPress={() => console.log('이름 수정')}
          >
            <Text style={commonStyles.buttonText}>수정하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default NameEdit;
