import React, { useState, useRef } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/TutorialScreen';
import { tutorialScreens } from '../datas/tutorialData';
import type { TutorialScreen } from '../datas/tutorialData';
import TutorialSlide from '../components/TutorialSlide/TutorialSlide';

const { width } = Dimensions.get('window');

function TutorialScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < tutorialScreens.length - 1) {
            const nextIndex = currentIndex + 1;
            try {
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            } catch (error) {
                console.error('Failed to scroll to index:', error);
                return;
            }
            setCurrentIndex(nextIndex);
        } else {
            // TODO: Navigate to login or home screen
            console.log('Tutorial completed');
        }
    };

    const renderItem = ({ item }: { item: TutorialScreen }) => (
        <TutorialSlide item={item} onNext={handleNext} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={tutorialScreens}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                bounces={false}
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                onScrollToIndexFailed={info => {
                    const wait = new Promise(resolve =>
                        setTimeout(resolve, 500),
                    );
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({
                            index: info.index,
                            animated: true,
                        });
                    });
                }}
            />
        </SafeAreaView>
    );
}

export default TutorialScreen;
