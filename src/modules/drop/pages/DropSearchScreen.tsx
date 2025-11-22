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

const MusicItem = React.memo(({ item, onPress, disabled }: { item: SongSearchItem; onPress: () => void; disabled?: boolean }) => (
    <Music
        musicTitle={item.title}
        singer={item.artist}
        imgUrl={item.albumImagePath}
        onPress={onPress}
        disabled={disabled}
    />
), (prevProps, nextProps) => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.item.title === nextProps.item.title &&
        prevProps.item.artist === nextProps.item.artist &&
        prevProps.item.albumImagePath === nextProps.item.albumImagePath
    );
});

function DropSearchScreen(){
    const [searchingText,setSearchingText] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [currentAddress, setCurrentAddress] = useState("");
    const [addressLoading, setAddressLoading] = useState(true);

    const { location } = useLocation();

    useEffect(() => {
        if (location) {
            const getAddressFromCoordinates = async (lat: number, lng: number) => {
                setAddressLoading(true);
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${GOOGLE_MAPS_API_KEY}`,
                        { signal: controller.signal }
                    );
                    clearTimeout(timeoutId);

                    const data = await response.json();

                    if (data.status === 'OK' && data.results.length > 0) {
                        const address = data.results[0].formatted_address;
                        setCurrentAddress(address);
                    } else {
                        setCurrentAddress("대한민국");
                    }
                } catch (error) {
                    console.log('주소 변환 실패, 기본값 사용:', error);
                    setCurrentAddress("대한민국");
                } finally {
                    setAddressLoading(false);
                }
            };
            getAddressFromCoordinates(location.latitude, location.longitude);
        } else {
            setAddressLoading(true);
            setCurrentAddress("");
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

    const isGloballyDisabled = useMemo(() => {
        return addressLoading || !currentAddress || currentAddress.trim() === "" ||
            currentAddress.includes("가져오는 중") || currentAddress.includes("로딩") || currentAddress.includes("...");
    }, [addressLoading, currentAddress]);

    const handleItemPress = useCallback((item: SongSearchItem) => {
        if (isGloballyDisabled) {
            return;
        }

        navigation.navigate("DropDetail", {
            musicTitle: item.title,
            singer: item.artist,
            musicTime: item.duration,
            songId: item.id,
            imgUrl: item.albumImagePath,
            hlsPath: item.hlsPath,
            location: currentAddress,
        });
    }, [navigation, currentAddress, isGloballyDisabled]);

    const renderItem = useCallback(({ item }: { item: SongSearchItem }) => {
        const onPress = () => handleItemPress(item);
        return <MusicItem item={item} onPress={onPress} disabled={isGloballyDisabled} />;
    }, [handleItemPress, isGloballyDisabled]);

    const keyExtractor = useCallback((item: SongSearchItem) => item.id, []);

    const ListEmptyComponent = useMemo(() => {
        if (addressLoading) {
            return (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#FFF', marginBottom: 8 }}>위치 정보를 가져오는 중...</Text>
                    <Text style={{ color: '#888', fontSize: 12, textAlign: 'center' }}>
                        위치 정보를 가져온 후 음악을 선택할 수 있습니다
                    </Text>
                </View>
            );
        }
        if (isLoading) {
            return <Text>로딩중...</Text>;
        }
        if (error) {
            return <Text style={{ color: 'red' }}>에러: {error.message}</Text>;
        }
        return <Text>음악 목록이 없습니다.</Text>;
    }, [isLoading, error, addressLoading]);

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
                removeClippedSubviews={false}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={100}
                windowSize={5}
                initialNumToRender={8}
                getItemLayout={(_data, index) => ({
                    length: 74,
                    offset: 74 * index,
                    index,
                })}
                disableVirtualization={false}
            />
        </SafeAreaView>
    )
}

export default DropSearchScreen;