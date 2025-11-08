import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { styles } from '../styles/CustomShopScreen';
import Icon, { IconName } from '../../../components/icon/Icon';
import ItemCard from './ItemCard';

interface Item {
    id: string;
    name: string;
    price: number;
    color?: string;
    type?: 'title' | 'player' | 'mystery';
}

interface UserInventory {
    ownedItems: string[];
    equippedItems: {
        title?: string;
        player?: string;
    };
}

interface ShopSectionProps {
    icon?: IconName;
    title: string;
    items: Item[];
    buttonText: string;
    showPrice?: boolean;
    onButtonPress?: (item: Item) => void;
    userInventory?: UserInventory;
}

function ShopSection({
    icon,
    title,
    items,
    buttonText,
    showPrice = true,
    onButtonPress,
    userInventory,
}: ShopSectionProps) {
    const isItemEquipped = (item: Item) => {
        if (!userInventory) return false;

        if (item.type === 'title') {
            return userInventory.equippedItems.title === item.id;
        } else if (item.type === 'player') {
            return userInventory.equippedItems.player === item.id;
        }
        return false;
    };

    return (
        <View style={styles.contentContainer}>
            <View style={styles.section}>
                <View style={styles.nav}>
                    {icon && <Icon name={icon} />}
                    <Text style={styles.navText}>{title}</Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {items.map(item => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            buttonText={buttonText}
                            showPrice={showPrice}
                            isEquipped={isItemEquipped(item)}
                            onButtonPress={onButtonPress}
                        />
                    ))}
                </ScrollView>
                <View style={styles.sectionFooter} />
            </View>
        </View>
    );
}

export default ShopSection;
