import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../../../types/navigation';
import { TEXT_COLORS } from '../../../constants/colors';
import userProfileScreen from '../styles/userProfileScreen';
import Header from '../components/Header';
import DropItem from '../components/DropItem';
import { dropMockData, likeMockData } from '../datas/mockData';
import Icon from '../../../components/icon/Icon';

function UserProfileScreen() {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const [activeTab, setActiveTab] = useState<'drop' | 'like'>('drop');

    const currentData = activeTab === 'drop' ? dropMockData : likeMockData;

    const handleEditPress = () => {
        navigation.navigate('NameEdit');
    };

    const handleSettingPress = () => {
        navigation.navigate('Setting');
    };

    return (
        <SafeAreaView style={userProfileScreen.safeAreaView}>
            <View style={userProfileScreen.container}>
                <Header
                    title="프로필"
                    rightComponent={
                        <TouchableOpacity onPress={handleSettingPress}>
                            <Icon
                                name="setting"
                                width={20}
                                height={20}
                                color={TEXT_COLORS.DEFAULT}
                            />
                        </TouchableOpacity>
                    }
                />
                <View style={userProfileScreen.profileContainer}>
                    <Image
                        source={require('../../../assets/images/profileImage.png')}
                        style={userProfileScreen.profileImage}
                    />
                    <View style={userProfileScreen.aliasContainer}>
                        <Text style={userProfileScreen.aliasText}>모험가</Text>
                    </View>
                    <View style={userProfileScreen.profileNameContainer}>
                        <Text style={userProfileScreen.userNameText}>
                            User_1
                        </Text>
                        <TouchableOpacity onPress={handleEditPress}>
                            <Icon
                                name="edit"
                                width={20}
                                height={20}
                                color={TEXT_COLORS.CAPTION}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={userProfileScreen.tabContainer}>
                    <View style={userProfileScreen.nav}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('drop')}
                            activeOpacity={1}
                        >
                            <Text
                                style={[
                                    userProfileScreen.navText,
                                    activeTab === 'drop' &&
                                        userProfileScreen.navTextActive,
                                ]}
                            >
                                드랍
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('like')}
                            activeOpacity={1}
                        >
                            <Text
                                style={[
                                    userProfileScreen.navText,
                                    activeTab === 'like' &&
                                        userProfileScreen.navTextActive,
                                ]}
                            >
                                좋아요
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {currentData.map((item, index) => (
                        <DropItem
                            key={`${item.memo}-${item.location}-${index}`}
                            memo={item.memo}
                            location={item.location}
                            imageSource={item.imageSource}
                            hasHeart={item.hasHeart}
                        />
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}
export default UserProfileScreen;
