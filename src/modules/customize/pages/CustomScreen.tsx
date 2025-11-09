import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/CustomShopScreen';
import Header from '../../profile/components/Header';
import { sections } from '../datas/shopItems';
import ShopSection from '../components/ShopSection';

function CustomScreen() {
    // 초기 상태: 기본 아이템만 보유
    const [userInventory, setUserInventory] = useState({
        ownedItems: ['0', '1', '10', '20', '21', '22'], // 모험가, 열렬한 탐험가, 기본 플레이어, 미스터리 아이템 3개
        equippedItems: {
            title: '0',    // 모험가 장착
            player: '10'   // 기본 플레이어 장착
        },
    });

    const handleEquip = (item: any) => {
        const itemType = item.type; // 'title' | 'player' | 'mystery'

        // 현재 장착 중인지 확인
        const isCurrentlyEquipped =
            (itemType === 'title' && userInventory.equippedItems.title === item.id) ||
            (itemType === 'player' && userInventory.equippedItems.player === item.id);

        setUserInventory(prev => ({
            ...prev,
            equippedItems: {
                ...prev.equippedItems,
                [itemType]: isCurrentlyEquipped ? undefined : item.id,
            },
        }));
    };

    const filteredSections = sections.map(section => ({
        ...section,
        items: section.items.filter(item =>
            userInventory.ownedItems.includes(item.id),
        ),
    }));

    return (
        <SafeAreaView style={styles.container}>
            <Header title="커스텀" titleStyle={styles.headerTitle} />
            <ScrollView style={styles.scrollContainer}>
                {filteredSections.map(section => (
                    <ShopSection
                        key={section.title}
                        icon={section.icon}
                        title={section.title}
                        items={section.items}
                        buttonText="장착"
                        showPrice={false}
                        onButtonPress={handleEquip}
                        userInventory={userInventory}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default CustomScreen;
