import { View, SafeAreaView, Text, ScrollView } from "react-native";
import { styles, historyStyles } from "../styles/DropSearchScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import { useState, useEffect } from "react";
import Icon from "../../../components/icon/Icon";
import Input from "../../../components/input/Input";
import History from "../components/History/History";
import Music from "../components/Music/Music";
import { scale } from "../../../utils/scalers";
import findMusic from "../utils/findMusic";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { DropStackParamList } from '../../../navigation/DropStack';
import { useSongSearch, SongSearchItem } from "../hooks/useSongSearch";
import useLocation from "../../../hooks/useLocation";
import { GOOGLE_MAPS_API_KEY } from "../../../constants/map";

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

    const onSearch = () => {
        if (searchingText && !searchHistory.includes(searchingText)) {
          setSearchHistory([searchingText, ...searchHistory].slice(0, 5));
        }
    };

    const navigation = useNavigation<StackNavigationProp<DropStackParamList, 'DropSearch'>>();
    const { data: searchResult, isLoading, error } = useSongSearch(searchingText);

    return(
        <SafeAreaView style = {styles.container}>
            <View style = {styles.inputContainer}>
                <Icon name="left" width={24} height={24} fill="#FFFFFF" />
                <Input 
                placeholder="드랍할 음악 검색" 
                width={scale(287)}
                value = {searchingText}
                onChangeText = {setSearchingText}
                onSubmitEditing = {onSearch}
                ></Input>
            </View>
            <ScrollView
                style={styles.searchMusicContainer}
                contentContainerStyle={styles.searchMusicContent}
            >
                {isLoading ? (
                    <Text>로딩중...</Text>
                ) : error ? (
                    <Text style={{ color: 'red' }}>에러: {error.message}</Text>
                ) : searchResult && searchResult.length > 0 ? (
                    searchResult.map((item: SongSearchItem, idx: number) => (
                        <Music
                            key={item.id}
                            musicTitle={item.title}
                            singer={item.artist}
                            imgUrl={item.albumImageUrl}
                            onPress={() =>
                                navigation.navigate("DropDetail", {
                                    musicTitle: item.title,
                                    singer: item.artist,
                                    musicTime: item.duration,
                                    songId: item.id,
                                    imgUrl: "",
                                    previewUrl: '', 
                                    location: currentAddress,
                                })
                            }
                        />
                    ))
                ) : (
                    <Text>음악 목록이 없습니다.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default DropSearchScreen;