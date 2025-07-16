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
import { useSongSearch } from "../hooks/useSongSearch";

function DropSearchScreen(){
    const [searchingText,setSearchingText] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    const onSearch = () => {
        if (searchingText && !searchHistory.includes(searchingText)) {
          setSearchHistory([searchingText, ...searchHistory].slice(0, 5));
        }
    };

    const navigation = useNavigation<StackNavigationProp<DropStackParamList, 'DropSearch'>>();
    const { data: searchResult, isLoading } = useSongSearch(searchingText);

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
            {searchingText === "" ? 
            (
                <>
                <View style = {historyStyles.logContainer}>
                    <View style = {styles.textContainer}>
                        <Text style = {[TYPOGRAPHY.BODY_1, historyStyles.logText]}>검색 기록</Text>
                        <View style = {historyStyles.historyContainer}>
                        {searchHistory.map((item, idx) => (
                            <History key={item + idx} musicTitle={item} />
                        ))}
                        </View>
                    </View>
                </View>
                <View style = {styles.recommendMusicContainer}>
                    <View style = {styles.textContainer}>
                        <Text style = {[TYPOGRAPHY.HEADLINE_2, styles.recommendText]}>추천 음악</Text>
                        <Music musicTitle="LILAC" singer="아이유"></Music>
                        <Music musicTitle="LILAC" singer="아이유"></Music>
                        <Music musicTitle="LILAC" singer="아이유"></Music>
                    </View>
                </View>
                </>
            )
            : 
            <ScrollView
                style={styles.searchMusicContainer}
                contentContainerStyle={styles.searchMusicContent}
            >
                {isLoading ? (
                    <Text>로딩중...</Text>
                ) : (
                    searchResult?.map((item, idx) => (
                        <Music
                            key={item.id}
                            musicTitle={item.title}
                            singer={item.artist}
                            imgUrl={""} // 서버에서 이미지 URL 주면 넣기
                            onPress={() =>
                                navigation.navigate("DropDetail", {
                                    musicTitle: item.title,
                                    singer: item.artist,
                                    musicTime: item.duration,
                                    location: "부산광역시 해운대구",
                                })
                            }
                        />
                    ))
                )}
            </ScrollView>
            }
        </SafeAreaView>
    )
}

export default DropSearchScreen;