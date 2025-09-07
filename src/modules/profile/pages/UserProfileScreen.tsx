import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../../../types/navigation';
import { TEXT_COLORS } from '../../../constants/colors';
import { dropMockData, likeMockData } from '../datas/mockData';
import styles from '../styles/userProfileScreen';
import Header from '../components/Header';
import DropItem from '../components/DropItem';
import Icon from '../../../components/icon/Icon';
import Button from '../../../components/button/Button';
import { useMyProfile } from '../hooks/useMyProfile';

function UserProfileScreen() {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const [activeTab, setActiveTab] = useState<'drop' | 'like'>('drop');
    const currentData = activeTab === 'drop' ? dropMockData : likeMockData;
    const defaultProfileImg = require('../../../assets/images/profileImage.png');

    const {data : me, isLoading, isError, refetch, isFetching } = useMyProfile();

    const handleEditPress = () => {
        navigation.navigate('NameEdit');
    };

    const handleSettingPress = () => {
        navigation.navigate('Setting');
    };

    const handleRefetchProfile = () => {
        refetch();
    }
    
    if(isLoading){
        return (
            <SafeAreaView style={styles.safeAreaView}>
              <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8 }}>프로필 정보를 불러오고 있습니다!</Text>
              </View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
          <SafeAreaView style={styles.safeAreaView}>
            <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
              <Text>프로필 정보를 가져오는데 실패했어요!.</Text>
              <Button title = "다시 시도하기" onPress = {handleRefetchProfile}></Button>
            </View>
          </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>
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
                <View style={styles.profileContainer}>
                    <Image
                        source={me?.profileImageUrl ? {uri : me.profileImageUrl} : defaultProfileImg}
                        style={styles.profileImage}
                    />
                    <View style={styles.aliasContainer}>
                        <Text style={styles.aliasText}>모험가</Text>
                    </View>
                    <View style={styles.profileNameContainer}>
                        <Text style={styles.userNameText}>
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

                <View style={styles.tabContainer}>
                    <View style={styles.nav}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('drop')}
                            activeOpacity={1}
                        >
                            <Text
                                style={[
                                    styles.navText,
                                    activeTab === 'drop' &&
                                        styles.navTextActive,
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
                                    styles.navText,
                                    activeTab === 'like' &&
                                        styles.navTextActive,
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
