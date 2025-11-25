import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Modal, TextInput, FlatList } from 'react-native';
import { scale, verticalScale } from '../../../utils/scalers';
import { TEXT_COLORS, FORM_COLORS, PRIMARY_COLORS } from '../../../constants/colors';
import Icon from '../../../components/icon/Icon';
import type { Playlist } from '../types/Playlist';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addSongToPlaylist, deletePlaylist, renamePlaylist } from '../api/playlistApi';
import { listSongs } from '../../drop/api/dropApi';

interface PlaylistGridProps {
    playlists: Playlist[];
    onCreatePlaylist?: () => void;
}

const PlaylistCard: React.FC<{ playlist: Playlist; onPressMore: (p: Playlist) => void }> = ({ playlist, onPressMore }) => (
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
            <TouchableOpacity style={styles.playlistMoreButton} onPress={() => onPressMore(playlist)}>
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
    const [menuVisible, setMenuVisible] = useState(false);
    const [renameVisible, setRenameVisible] = useState(false);
    const [addSongVisible, setAddSongVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [newName, setNewName] = useState('');
    const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
    const queryClient = useQueryClient();

    const songsQuery = useQuery({
        queryKey: ['songs', addSongVisible],
        queryFn: listSongs,
        enabled: addSongVisible,
        staleTime: 5 * 60 * 1000,
    });

    const filteredSongs = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();
        const songs = Array.isArray(songsQuery.data) ? songsQuery.data : [];
        if (!keyword) return songs.slice(0, 30);
        return songs.filter((s: any) => {
            const title = String(s.title || '').toLowerCase();
            const artist = String(s.artist || '').toLowerCase();
            return title.includes(keyword) || artist.includes(keyword);
        }).slice(0, 30);
    }, [songsQuery.data, searchText]);

    const renameMutation = useMutation({
        mutationFn: ({ id, name }: { id: string | number; name: string }) => renamePlaylist(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists', 'my'] });
            setRenameVisible(false);
            setMenuVisible(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string | number) => deletePlaylist(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists', 'my'] });
            setMenuVisible(false);
        },
    });

    const addSongMutation = useMutation({
        mutationFn: ({ id, songId }: { id: string | number; songId: string }) => addSongToPlaylist(id, songId),
        onSuccess: () => {
            setAddSongVisible(false);
            setMenuVisible(false);
        },
    });

    const openMenu = (playlist: Playlist) => {
        setActivePlaylist(playlist);
        setMenuVisible(true);
    };

    const openRename = () => {
        if (!activePlaylist) return;
        setNewName(activePlaylist.name);
        setRenameVisible(true);
    };

    const openAddSong = () => {
        setSearchText('');
        setAddSongVisible(true);
    };

    const handleRenameSubmit = () => {
        if (!activePlaylist) return;
        renameMutation.mutate({ id: activePlaylist.id, name: newName.trim() });
    };

    const handleDelete = () => {
        if (!activePlaylist) return;
        deleteMutation.mutate(activePlaylist.id);
    };

    const handleAddSong = (songId: string) => {
        if (!activePlaylist) return;
        addSongMutation.mutate({ id: activePlaylist.id, songId });
    };

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
                            return <PlaylistCard key={item.data.id} playlist={item.data} onPressMore={openMenu} />;
                        }
                    })}
                    {/* 홀수 개일 경우 빈 공간 채우기 */}
                    {row.length === 1 && <View style={styles.playlistItem} />}
                </View>
            ))}

            <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
                <View style={styles.overlayContainer}>
                    <TouchableOpacity style={styles.overlayBg} activeOpacity={1} onPress={() => setMenuVisible(false)} />
                    <View style={styles.menuCard}>
                        <TouchableOpacity style={styles.menuItem} onPress={openAddSong}>
                            <Icon name="plus" width={18} height={18} color="#E9E2E3" />
                            <Text style={styles.menuText}>음악 추가</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.menuItem} onPress={openRename}>
                            <Icon name="edit" width={18} height={18} color="#E9E2E3" />
                            <Text style={styles.menuText}>이름 수정</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                            <Icon name="trash" width={18} height={18} color="#F3124E" />
                            <Text style={[styles.menuText, styles.menuDeleteText]}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal transparent visible={renameVisible} animationType="fade" onRequestClose={() => setRenameVisible(false)}>
                <View style={styles.overlayContainer}>
                    <TouchableOpacity style={styles.overlayBg} activeOpacity={1} onPress={() => setRenameVisible(false)} />
                    <View style={styles.sheet}>
                        <Text style={styles.sheetTitle}>플레이리스트 이름 수정</Text>
                        <TextInput
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="플레이리스트 이름"
                            placeholderTextColor={TEXT_COLORS.CAPTION_1}
                            style={styles.input}
                        />
                        <View style={styles.sheetButtons}>
                            <TouchableOpacity style={styles.sheetButton} onPress={() => setRenameVisible(false)}>
                                <Text style={styles.cancelText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sheetButton} onPress={handleRenameSubmit} disabled={renameMutation.isPending}>
                                <Text style={styles.confirmText}>저장</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal transparent visible={addSongVisible} animationType="fade" onRequestClose={() => setAddSongVisible(false)}>
                <View style={styles.overlayContainer}>
                    <TouchableOpacity style={styles.overlayBg} activeOpacity={1} onPress={() => setAddSongVisible(false)} />
                    <View style={styles.sheetLarge}>
                        <Text style={styles.sheetTitle}>음악 추가</Text>
                        <TextInput
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholder="곡/아티스트 검색"
                            placeholderTextColor={TEXT_COLORS.CAPTION_1}
                            style={styles.input}
                        />
                        <FlatList
                            data={filteredSongs}
                            keyExtractor={(item: any) => item.id || item.songId || item.title}
                            style={{ maxHeight: verticalScale(260), marginTop: verticalScale(8) }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.songItem}
                                    onPress={() => handleAddSong(item.id || item.songId)}
                                >
                                    <View>
                                        <Text style={styles.songTitle}>{item.title || '제목 없음'}</Text>
                                        <Text style={styles.songArtist}>{item.artist || '알 수 없는 아티스트'}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                        <View style={styles.sheetButtons}>
                            <TouchableOpacity style={styles.sheetButton} onPress={() => setAddSongVisible(false)}>
                                <Text style={styles.cancelText}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    overlayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(24),
    },
    overlayBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    menuCard: {
        width: '75%',
        backgroundColor: '#1E1E29',
        borderRadius: scale(18),
        paddingVertical: scale(16),
        paddingHorizontal: scale(20),
        gap: scale(10),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        paddingVertical: scale(6),
    },
    menuText: {
        color: '#E9E2E3',
        fontSize: scale(16),
        fontWeight: '600',
    },
    menuDeleteText: {
        color: '#F3124E',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginVertical: scale(4),
    },
    sheet: {
        width: '85%',
        backgroundColor: '#1E1E29',
        borderRadius: scale(18),
        padding: scale(16),
    },
    sheetLarge: {
        width: '90%',
        backgroundColor: '#1E1E29',
        borderRadius: scale(18),
        padding: scale(16),
    },
    sheetTitle: {
        color: '#E9E2E3',
        fontSize: scale(16),
        fontWeight: '700',
        marginBottom: verticalScale(10),
    },
    input: {
        backgroundColor: '#11111A',
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        color: '#E9E2E3',
        borderWidth: 1,
        borderColor: '#2E2E3A',
    },
    sheetButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: scale(12),
        marginTop: verticalScale(12),
    },
    sheetButton: {
        paddingHorizontal: scale(10),
        paddingVertical: scale(8),
    },
    cancelText: {
        color: TEXT_COLORS.CAPTION_1,
        fontSize: scale(14),
    },
    confirmText: {
        color: PRIMARY_COLORS.DEFAULT,
        fontSize: scale(14),
        fontWeight: '700',
    },
    songItem: {
        paddingVertical: verticalScale(10),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#2E2E3A',
    },
    songTitle: {
        color: '#E9E2E3',
        fontSize: scale(14),
        fontWeight: '600',
    },
    songArtist: {
        color: TEXT_COLORS.CAPTION_1,
        fontSize: scale(12),
        marginTop: verticalScale(2),
    },
});

export default PlaylistGrid;
