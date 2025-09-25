import { View, SafeAreaView, Text, ScrollView } from "react-native";
import { styles, historyStyles } from "../styles/DropSearchScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import { useState } from "react";
import BackSvg from "../../auth/components/BackSvg/BackSvg";
import Input from "../../../components/input/Input";
import History from "../components/History/History";
import Music from "../components/Music/Music";
import { scale } from "../../../utils/scalers";
import findMusic from "../utils/findMusic";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { DropStackParamList } from '../../../navigation/DropStack';
import { useSongSearch, SongSearchItem } from "../hooks/useSongSearch";

function DropSearchScreen(){
    const [searchingText,setSearchingText] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

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
                <BackSvg></BackSvg>
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
                            imgUrl=""
                            onPress={() =>
                                navigation.navigate("DropDetail", {
                                    musicTitle: item.title,
                                    singer: item.artist,
                                    musicTime: item.duration,
                                    songId: item.id,
                                    imgUrl: "",
                                    previewUrl: '', 
                                    location: "부산광역시 강서구 가락대로 1393",
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