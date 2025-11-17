import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/CustomShopScreen';
import Icon from '../../../components/icon/Icon';

interface Item {
    id: string;
    name: string;
    price: number;
    color?: string;
    type?: 'title' | 'player' | 'mystery';
}

interface ItemCardProps {
    item: Item;
    buttonText: string;
    showPrice?: boolean;
    isEquipped?: boolean;
    onButtonPress?: (item: Item) => void;
}

function ItemCard({
    item,
    buttonText,
    showPrice,
    isEquipped,
    onButtonPress,
}: ItemCardProps) {

    const renderItemPreview = () => {
        if (item.type === 'player') {
            // 플레이어: 원형 컬러 아이콘
            return (
                <View
                    style={[
                        styles.playerCircle,
                        { backgroundColor: item.color },
                    ]}
                />
            );
        } else if (item.type === 'mystery') {
            // 미스터리: ?? 배지
            return (
                <View style={styles.mysteryBadge}>
                    <Text style={styles.mysteryText}>??</Text>
                </View>
            );
        } else {
            // 칭호: 텍스트가 들어간 배지
            const badgeColor = item.color || '#E63B7A'; // 기본 색상
            return (
                <View style={[styles.titleBadge, { borderColor: badgeColor }]}>
                    <Text
                        style={[styles.titleBadgeText, { color: badgeColor }]}
                    >
                        {item.name}
                    </Text>
                </View>
            );
        }
    };

    return (
        <View style={styles.card}>
            <View style={showPrice ? styles.itemWrapper : styles.itemWrapperCentered}>
                {renderItemPreview()}
                {showPrice && (
                    <View style={styles.coinWrapper}>
                        <Text style={styles.priceText}>{item.price}</Text>
                        <Icon name="coin" />
                    </View>
                )}
            </View>
            <TouchableOpacity
                style={[styles.buyButton, isEquipped && styles.equippedButton]}
                onPress={() => onButtonPress?.(item)}
            >
                <Text style={[styles.buyText, isEquipped && styles.equippedButtonText]}>
                    {isEquipped ? '장착됨' : buttonText}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default ItemCard;
