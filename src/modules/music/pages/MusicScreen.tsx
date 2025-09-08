import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/MusicScreen.ts';
import Icon from '../../../components/icon/Icon.tsx';
import { PRIMARY_COLORS } from '../../../constants/colors';
import { TEXT_COLORS } from '../../../constants/colors';
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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.innerContainer}>
                    <CdPlayer />
                    <View style={styles.content}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoTextWrapper}>
                                <Text style={styles.title}>LILAC</Text>
                                <Text style={styles.artist}>by IU</Text>
                            </View>

                            <View style={styles.likeCommentRow}>
                                <TouchableOpacity
                                    style={styles.smallLikeCommentRow}
                                >
                                    <Icon
                                        name="like"
                                        width={16}
                                        height={16}
                                        color={TEXT_COLORS.DEFAULT}
                                    />
                                    <Text style={styles.likeCommentText}>
                                        21
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.smallLikeCommentRow}
                                >
                                    <Icon
                                        name="chat"
                                        width={16}
                                        height={16}
                                        color={TEXT_COLORS.DEFAULT}
                                    />
                                    <Text style={styles.likeCommentText}>
                                        3
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <PlayBar
                            currentTime={0}
                            musicTime={192}
                            onSeek={value => console.log('Seek to:', value)}
                        />
                    </View>

                    <View style={styles.inner}>
                        <View style={styles.userRow}>
                            <View style={styles.userDot} />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>User_1</Text>
                                <View style={styles.userBadge}>
                                    <Text style={styles.userBadgeText}>
                                        모험가
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.messageBox}>
                            <Text style={styles.messageText}>
                                이 길을 지날때마다 이 노래가 생각 나더군요.
                                여러분도 노래 듣고 힘내시길
                            </Text>
                            <View style={styles.messageLocationRow}>
                                <Icon
                                    name="location"
                                    width={14}
                                    height={14}
                                    color={PRIMARY_COLORS.DEFAULT}
                                />
                                <Text style={styles.messageLocation}>
                                    부산광역시 강서구 가락대로 1393
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.commentSection}>
                        <Text style={styles.commentTitle}>댓글</Text>
                        <View style={styles.commentInputRow}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="댓글 작성"
                                placeholderTextColor={TEXT_COLORS.CAPTION_RED}
                                value={comment}
                                onChangeText={setComment}
                            />
                            <TouchableOpacity
                                style={styles.commentButton}
                                onPress={handlePost}
                            >
                                <Text style={styles.commentButtonText}>
                                    게시
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={commentList}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.commentItemWrapper}>
                                    <View style={styles.commentItemInfo}>
                                        <View
                                            style={[
                                                styles.userDot,
                                                { backgroundColor: item.color },
                                            ]}
                                        />
                                        <Text style={[styles.userName]}>
                                            {item.user}
                                        </Text>
                                    </View>
                                    <Text style={styles.commentItemText}>
                                        {item.text}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default MusicScreen;
