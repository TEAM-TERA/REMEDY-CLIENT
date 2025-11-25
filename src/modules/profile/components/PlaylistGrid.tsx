import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { scale, verticalScale } from '../../../utils/scalers';
import { TEXT_COLORS, FORM_COLORS, PRIMARY_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import Icon from '../../../components/icon/Icon';
import type { Playlist } from '../types/Playlist';

interface PlaylistGridProps {
    playlists: Playlist[];
    onCreatePlaylist?: () => void;
}

const PlaylistCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => (
    <View style={styles.playlistItem}>
        <View style={styles.playlistContainer}>
            <View style={styles.playlistHeaderBar} />
            <View style={styles.playlistImageContainer}>
                <Image
                    source={require('../../../assets/images/profileImage.png')}
                    style={styles.playlistThumbnail}
                />
            </View>
        </View>
        <View style={styles.playlistBottomInfo}>
            <Text style={styles.playlistTitle} numberOfLines={1}>
                {playlist.name}
            </Text>
            <TouchableOpacity style={styles.playlistMoreButton}>
                <View style={styles.moreDot} />
                <View style={styles.moreDot} />
                <View style={styles.moreDot} />
            </TouchableOpacity>
        </View>
    </View>
);

const CreatePlaylistCard: React.FC<{ onPress?: () => void }> = ({ onPress }) => (
    <TouchableOpacity style={styles.playlistItem} onPress={onPress}>
        <View style={styles.createPlaylistContainer}>
            <View style={styles.createPlaylistHeaderBar} />
            <View style={styles.createPlaylistImageContainer}>
                <View style={styles.createPlaylistIconContainer}>
                    <Icon name="edit" width={24} height={24} color={PRIMARY_COLORS.DEFAULT} />
                </View>
                <Text style={styles.createPlaylistText}>새 플레이리스트</Text>
            </View>
        </View>
        <View style={styles.playlistBottomInfo}>
            <Text style={styles.createPlaylistTitle}>플레이리스트 만들기</Text>
        </View>
    </TouchableOpacity>
);

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists, onCreatePlaylist }) => {
    // 생성 버튼을 포함한 전체 아이템 배열 생성
    const allItems = [{ type: 'create' as const }, ...playlists.map(p => ({ type: 'playlist' as const, data: p }))];

    // 아이템들을 2개씩 그룹화
    const itemRows = [];
    for (let i = 0; i < allItems.length; i += 2) {
        itemRows.push(allItems.slice(i, i + 2));
    }

    return (
        <>
            {itemRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.playlistRow}>
                    {row.map((item, itemIndex) => {
                        if (item.type === 'create') {
                            return <CreatePlaylistCard key="create" onPress={onCreatePlaylist} />;
                        } else {
                            return <PlaylistCard key={item.data.id} playlist={item.data} />;
                        }
                    })}
                    {/* 홀수 개일 경우 빈 공간 채우기 */}
                    {row.length === 1 && <View style={styles.playlistItem} />}
                </View>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    playlistRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(20),
    },
    playlistItem: {
        width: '48%',
        gap: scale(12),
    },
    playlistContainer: {
        position: 'relative',
    },
    playlistHeaderBar: {
        height: scale(8),
        backgroundColor: FORM_COLORS.BACKGROUND_2,
        borderColor: FORM_COLORS.STROKE,
        borderWidth: 1,
        borderTopLeftRadius: scale(8),
        borderTopRightRadius: scale(8),
        marginBottom: 0,
        paddingHorizontal: scale(8),
    },
    playlistImageContainer: {
        height: scale(72),
        backgroundColor: '#333333',
        borderRadius: scale(8),
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playlistThumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    playlistBottomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(4),
    },
    playlistTitle: {
        flex: 1,
        color: TEXT_COLORS.BUTTON,
        fontSize: scale(16),
        fontWeight: '500',
        lineHeight: scale(22),
    },
    playlistMoreButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: scale(12),
        paddingVertical: scale(4),
    },
    moreDot: {
        width: scale(3),
        height: scale(3),
        backgroundColor: TEXT_COLORS.CAPTION_1,
        borderRadius: scale(1.5),
        marginBottom: scale(4.5),
    },
    // Create playlist styles
    createPlaylistContainer: {
        position: 'relative',
    },
    createPlaylistHeaderBar: {
        height: scale(8),
        backgroundColor: FORM_COLORS.BACKGROUND_2,
        borderColor: FORM_COLORS.STROKE,
        borderWidth: 1,
        borderTopLeftRadius: scale(8),
        borderTopRightRadius: scale(8),
        marginBottom: 0,
        paddingHorizontal: scale(8),
    },
    createPlaylistImageContainer: {
        height: scale(72),
        backgroundColor: 'rgba(230, 31, 84, 0.1)',
        borderColor: 'rgba(230, 31, 84, 0.3)',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: scale(8),
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: scale(4),
    },
    createPlaylistIconContainer: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: 'rgba(230, 31, 84, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createPlaylistText: {
        color: PRIMARY_COLORS.DEFAULT,
        fontSize: scale(10),
        fontWeight: '500',
        lineHeight: scale(12),
    },
    createPlaylistTitle: {
        flex: 1,
        color: PRIMARY_COLORS.DEFAULT,
        fontSize: scale(16),
        fontWeight: '600',
        lineHeight: scale(22),
    },
});

export default PlaylistGrid;