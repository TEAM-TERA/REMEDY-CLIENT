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

interface ShopSectionProps {
    icon?: IconName;
    title: string;
    items: Item[];
    buttonText: string;
}

function ShopSection({ icon, title, items, buttonText }: ShopSectionProps) {
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
                        />
                    ))}
                </ScrollView>
                <View style={styles.sectionFooter} />
            </View>
        </View>
    );
}

export default ShopSection;
