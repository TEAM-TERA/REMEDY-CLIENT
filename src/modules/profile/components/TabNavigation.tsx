import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from '../../../components/icon/Icon';
import { scale } from '../../../utils/scalers';
import { TEXT_COLORS, PRIMARY_COLORS, SECONDARY_COLORS } from '../../../constants/colors';

interface TabNavigationProps {
    activeTab: 'drop' | 'like' | 'playlist';
    onTabPress: (tab: 'drop' | 'like' | 'playlist') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabPress }) => {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => onTabPress('drop')} style={styles.tabButton}>
                <Text style={[
                    styles.tabText,
                    activeTab === 'drop' && styles.activeTabText
                ]}>
                    드랍
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onTabPress('like')} style={styles.tabButton}>
                <Text style={[
                    styles.tabText,
                    activeTab === 'like' && styles.activeTabText
                ]}>
                    좋아요
                </Text>
            </TouchableOpacity>

            <View style={styles.tabButtonWithIcon}>
                <Icon
                    name="list"
                    width={scale(20)}
                    height={scale(14)}
                    color={activeTab === 'playlist' ? SECONDARY_COLORS.DEFAULT : TEXT_COLORS.CAPTION_1}
                />
                <TouchableOpacity onPress={() => onTabPress('playlist')} style={styles.tabButton}>
                    <Text style={[
                        styles.tabText,
                        activeTab === 'playlist' && styles.activePlaylistTabText
                    ]}>
                        플레이리스트
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(24),
        marginBottom: scale(24),
        paddingHorizontal: scale(8),
    },
    tabButton: {
        // No additional styles needed for basic button
    },
    tabButtonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
    },
    tabText: {
        color: TEXT_COLORS.CAPTION_1,
        fontSize: scale(16),
        fontWeight: '500',
        lineHeight: scale(22),
    },
    activeTabText: {
        color: PRIMARY_COLORS.DEFAULT,
        fontWeight: 'bold',
    },
    activePlaylistTabText: {
        color: SECONDARY_COLORS.DEFAULT,
        fontWeight: 'bold',
    },
});

export default TabNavigation;