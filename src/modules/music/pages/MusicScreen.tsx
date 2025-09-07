import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/MusicScreen.ts';
import LocationMarkerSvg from '../../drop/components/LocationMarker/LocationMarkerSvg';
import Button from '../../../components/button/Button';
import CdPlayer from '../../../components/cdPlayer/CdPlayer';
import PlayBar from '../../../components/playBar/PlayBar.tsx';

const comments = [
    {
        id: '1',
        user: 'User_2',
        color: '#FFA726',
        text: '마음이 편안해지는 노래네요',
    },
    { id: '2', user: 'User_3', color: '#7C4DFF', text: '쉬고 싶다' },
];

function MusicScreen() {
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState(comments);

    const handlePost = () => {
        if (comment.trim()) {
            setCommentList([
                ...commentList,
                {
                    id: String(commentList.length + 1),
                    user: 'User_1',
                    color: '#FF1744',
                    text: comment,
                },
            ]);
            setComment('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <CdPlayer />
                {/* 곡 정보 */}
                <View style={styles.infoWrapper}>
                    <Text style={styles.title}>LILAC</Text>
                    <Text style={styles.artist}>by IU</Text>
                    {/* 플레이바 */}
                    <PlayBar
                        currentTime={0}
                        musicTime={192}
                        onSeek={value => console.log('Seek to:', value)}
                    />
                    x{/* 좋아요/댓글 */}
                    <View style={styles.likeCommentRow}>
                        <Text style={styles.likeText}>♡ 21</Text>
                        <Text style={styles.commentText}>💬 3</Text>
                    </View>
                    {/* 유저 정보 */}
                    <View style={styles.userRow}>
                        <View style={styles.userDot} />
                        <Text style={styles.userName}>User_1</Text>
                        <View style={styles.userBadge}>
                            <Text style={styles.userBadgeText}>모험가</Text>
                        </View>
                    </View>
                    {/* 메시지 */}
                    <View style={styles.messageBox}>
                        <Text style={styles.messageText}>
                            이 길을 지날때마다 이 노래가 생각 나더군요. 여러분도
                            노래 듣고 힘내시길
                        </Text>
                        <Text style={styles.messageLocation}>
                            <LocationMarkerSvg />
                            부산광역시 강서구 가락대로 1393
                        </Text>
                    </View>
                    {/* 댓글 */}
                    <Text style={styles.commentTitle}>댓글</Text>
                    <View style={styles.commentInputRow}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="댓글 작성"
                            placeholderTextColor="#A1A1A1"
                            value={comment}
                            onChangeText={setComment}
                        />
                        <Button
                            title="게시"
                            onPress={() => {}}
                            disabled={false}
                        />
                    </View>
                    <FlatList
                        data={commentList}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.commentItemRow}>
                                <View
                                    style={[
                                        styles.commentItemDot,
                                        { backgroundColor: item.color },
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.commentItemUser,
                                        { color: item.color },
                                    ]}
                                >
                                    {item.user}
                                </Text>
                                <View style={styles.commentItemBox}>
                                    <Text style={styles.commentItemText}>
                                        {item.text}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default MusicScreen;
