import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/CustomShopScreen';
import Header from '../../profile/components/Header';
import Icon from '../../../components/icon/Icon';
import { sections } from '../datas/shopItems';
import ShopSection from '../components/ShopSection';

function CustomShopScreen() {
    // const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="커스텀 상점"
                titleStyle={styles.headerTitle}
                rightComponent={
                    <TouchableOpacity
                        onPress={() => {
                            /* TODO: 커스텀 인벤토리 화면으로 이동 */
                        }}
                    >
                        <Icon name={'customBox'} />
                    </TouchableOpacity>
                }
            />
            <ScrollView style={styles.scrollContainer}>
                {sections.map(section => (
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
