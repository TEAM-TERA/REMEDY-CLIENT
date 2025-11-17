import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/CustomShopScreen';
import Header from '../../profile/components/Header';
import { sections } from '../datas/shopItems';
import ShopSection from '../components/ShopSection';

function CustomScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Header title="커스텀" titleStyle={styles.headerTitle} />
            <ScrollView style={styles.scrollContainer}>
                {sections.map(section => (
                    <ShopSection
                        key={section.title}
                        icon={section.icon}
                        title={section.title}
                        items={section.items}
                        buttonText="장착"
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default CustomScreen;
