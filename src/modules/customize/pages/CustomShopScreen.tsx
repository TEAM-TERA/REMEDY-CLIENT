import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CustomStackParamList } from '../../../navigation/CustomStack';
import { styles } from '../styles/CustomShopScreen';
import Header from '../../profile/components/Header';
import Icon from '../../../components/icon/Icon';
import { sections } from '../datas/shopItems';
import ShopSection from '../components/ShopSection';

type NavigationProp = NativeStackNavigationProp<CustomStackParamList>;

function CustomShopScreen() {
    const navigation = useNavigation<NavigationProp>();

    const [userInventory] = useState({
        ownedItems: ['0', '1', '10'],
    });

    const shopSections = sections.map(section => ({
        ...section,
        items: section.items.filter(
            item => !userInventory.ownedItems.includes(item.id),
        ),
    }));

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="커스텀 상점"
                titleStyle={styles.headerTitle}
                rightComponent={
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('CustomDetail');
                        }}
                    >
                        <Icon name={'customBox'} />
                    </TouchableOpacity>
                }
            />
            <ScrollView style={styles.scrollContainer}>
                {shopSections.map(section => (
                    <ShopSection
                        key={section.title}
                        icon={section.icon}
                        title={section.title}
                        items={section.items}
                        buttonText="구매"
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default CustomShopScreen;
