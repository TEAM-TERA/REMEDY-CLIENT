import React from "react";
import { View, Text, FlatList } from "react-native";
import { styles } from "../styles/DropSearchScreen";
import { useState, useEffect, useCallback, useMemo } from "react";
import Icon from "../../../components/icon/Icon";
import Input from "../../../components/input/Input";
import Music from "../components/Music/Music";
import { scale } from "../../../utils/scalers";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { DropStackParamList } from '../../../navigation/DropStack';
import { useSongSearch, SongSearchItem } from "../hooks/useSongSearch";
import useLocation from "../../../hooks/useLocation";
import { SafeAreaView } from "react-native-safe-area-context";
import { GOOGLE_MAPS_API_KEY } from "../../../constants/map";

const MusicItem = React.memo(({ item, onPress }: { item: SongSearchItem; onPress: () => void }) => (
    <Music
        musicTitle={item.title}
        singer={item.artist}
        imgUrl={item.albumImagePath}
        onPress={onPress}
    />
));

function DropSearchScreen(){
    const [searchingText,setSearchingText] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [currentAddress, setCurrentAddress] = useState("위치 정보를 가져오는 중...");

    const { location } = useLocation();

    useEffect(() => {
        if (location) {
            const getAddressFromCoordinates = async (lat: number, lng: number) => {
                try {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${GOOGLE_MAPS_API_KEY}`
                    );
                    const data = await response.json();
                    
                    if (data.status === 'OK' && data.results.length > 0) {
                        const address = data.results[0].formatted_address;
                        setCurrentAddress(address);
                    } else {
                        setCurrentAddress("대한민국");
                    }
                } catch (error) {
                    setCurrentAddress("대한민국");
                }
            };
            getAddressFromCoordinates(location.latitude, location.longitude);
        }
    }, [location]);

    const onSearch = useCallback(() => {
        if (searchingText && !searchHistory.includes(searchingText)) {
          setSearchHistory([searchingText, ...searchHistory].slice(0, 5));
        }
    }, [searchingText, searchHistory]);

    const navigation = useNavigation<StackNavigationProp<DropStackParamList, 'DropSearch'>>();
    const { data: searchResult, isLoading, error } = useSongSearch(searchingText);

    const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

    const renderItem = useCallback(({ item }: { item: SongSearchItem }) => {
        const handlePress = () => {
            navigation.navigate("DropDetail", {
                musicTitle: item.title,
                singer: item.artist,
                musicTime: item.duration,
                songId: item.id,
                imgUrl: item.albumImagePath,
                hlsPath: item.hlsPath,
                location: currentAddress,
            });
        };
        return <MusicItem item={item} onPress={handlePress} />;
    }, [navigation, currentAddress]);

    const keyExtractor = useCallback((item: SongSearchItem) => item.id, []);

    const ListEmptyComponent = useMemo(() => {
        if (isLoading) {
            return <Text>로딩중...</Text>;
        }
        if (error) {
            return <Text style={{ color: 'red' }}>에러: {error.message}</Text>;
        }
        return <Text>음악 목록이 없습니다.</Text>;
    }, [isLoading, error]);

    return(
        <SafeAreaView style = {styles.container}>
            <View style = {styles.inputContainer}>
                <Icon name="left" width={24} height={24} fill="#FFFFFF" onPress={handleGoBack} />
                <Input
                    placeholder="드랍할 음악 검색"
                    containerWidth={scale(287)}
                    value = {searchingText}
                    onChangeText = {setSearchingText}
                    onSubmitEditing = {onSearch}
                />
            </View>
            <FlatList
                style={styles.searchMusicContainer}
                contentContainerStyle={styles.searchMusicContent}
                data={searchResult || []}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListEmptyComponent={ListEmptyComponent}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                windowSize={10}
                initialNumToRender={10}
            />
        </SafeAreaView>
    )
}

export default DropSearchScreen;