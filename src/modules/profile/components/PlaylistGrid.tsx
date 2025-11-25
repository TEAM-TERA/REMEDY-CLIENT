import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { scale, verticalScale } from '../../../utils/scalers';
import { TEXT_COLORS, FORM_COLORS } from '../../../constants/colors';

interface PlaylistItem {
    id: number;
    name: string;
    coverImage: any;
}

interface PlaylistGridProps {
    playlists: PlaylistItem[];
}

const PlaylistCard: React.FC<{ playlist: PlaylistItem }> = ({ playlist }) => (
    <View style={styles.playlistItem}>
        <View style={styles.playlistContainer}>
            <View style={styles.playlistHeaderBar} />
            <View style={styles.playlistImageContainer}>
                <Image
                    source={playlist.coverImage}
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

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists }) => {
    // 플레이리스트를 2개씩 그룹화
    const playlistRows = [];
    for (let i = 0; i < playlists.length; i += 2) {
        playlistRows.push(playlists.slice(i, i + 2));
    }

    return (
        <>
            {playlistRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.playlistRow}>
                    {row.map((playlist) => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
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
});

export default PlaylistGrid;