import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { styles } from '../styles/DropScreen';
import { TYPOGRAPHY } from '../../../constants/typography';
import { TEXT_COLORS } from '../../../constants/colors';
import PlayBar from '../../../components/playBar/PlayBar';
import CdPlayer from '../../../components/cdPlayer/CdPlayer';
import LocationMarkerSvg from '../components/LocationMarker/LocationMarkerSvg';
import GoogleMapView from '../../../components/map/GoogleMapView';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { DropStackParamList } from '../../../navigation/DropStack';
import { useCreateDropping } from '../hooks/useCreateDropping';
import { AuthContext } from '../../auth/auth-context';
import Button from '../../../components/button/Button';
import Geolocation from 'react-native-geolocation-service';
import { useQuery } from '@tanstack/react-query';
import { getSongInfo } from '../api/dropApi';
import { useHLSPlayer } from '../../../hooks/music/useHLSPlayer';
import { isPlaying } from 'react-native-track-player';

function DropScreen() {
    const route = useRoute<RouteProp<DropStackParamList, 'DropDetail'>>();
    const { musicTitle, singer, musicTime, location, imgUrl, previewUrl, songId } = route.params;
  
    const { userToken } = useContext(AuthContext);
    const createDroppingMutation = useCreateDropping();
  
    const [content, setContent] = useState('');
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const musicPlayer = useHLSPlayer(songId);
    const serverImageUrl = 'https://file.notion.so/f/f/f74ce79a-507a-45d0-8a14-248ea481b327/be9dcd92-96bb-4f75-b49b-80ff8b8758f5/image.png?table=block&id=2792845a-0c9f-80e5-9005-fa71e1c2f479&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&expirationTimestamp=1758844800000&signature=6xTJRZIFgl9yfwuj_TMjTuEBqz8wfkQM7QpcQ5Wk72w&downloadName=image.png';

    const { data: songInfo } = useQuery({
      queryKey: ['songInfo', songId],
      queryFn: () => getSongInfo(songId || ''),
      enabled: !!songId,
    });

    useEffect(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setCurrentLocation({
            latitude: 37.5665,
            longitude: 126.9780,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    }, []);

    useEffect(() => {
      if (songId) {
        musicPlayer.loadMusic(songId, imgUrl || serverImageUrl);
      }
    }, [songId, imgUrl]);
  
    const handleCreateDropping = () => {
      if (!userToken) {
        Alert.alert('로그인 필요', '드롭핑을 생성하려면 로그인이 필요합니다.');
        return;
      }

      if (!currentLocation) {
        Alert.alert('위치 오류', '위치 정보를 가져올 수 없습니다. 다시 시도해주세요.');
        return;
      }

      if (!songId) {
        Alert.alert('음악 오류', '음악 정보를 찾을 수 없습니다.');
        return;
      }

      createDroppingMutation.mutate(
        {
          songId: songId,
          content: content.trim(),
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          address: location,
        },
        {
          onSuccess: () => {
            Alert.alert('성공', '드롭핑이 성공적으로 생성되었습니다!');
          },
          onError: (err: any) => {
            console.error('드롭핑 생성 실패:', err);
            Alert.alert('실패', '드롭핑 생성에 실패했습니다.');
          },
        }
      );
    };
  
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <CdPlayer imageUrl={imgUrl || serverImageUrl} />
        <View style={styles.playerContainer}>
          <View style={styles.textContainer}>
            <Text style={[TYPOGRAPHY.HEADLINE_1, styles.titleText]}>{musicTitle}</Text>
            <Text style={[TYPOGRAPHY.SUBTITLE, styles.singerText]}>{singer}</Text>
          </View>
          <PlayBar
            currentTime={musicPlayer.currentTime}
            musicTime={musicPlayer.duration || musicTime || 30}
            onSeek={musicPlayer.seekTo}
            onTogglePlay={musicPlayer.togglePlay}
            isPlaying={musicPlayer.isPlaying}
          />
        </View>
  
        <View style={styles.informationContainer}>
          <View style={styles.remainTextContainer}>
            <Text style={[TYPOGRAPHY.SUBTITLE, styles.remainText]}>남길 한마디</Text>
            <TextInput
              style={styles.remainInput}
              placeholder="음악과 남길 한마디를 적어주세요"
              textAlignVertical="top"
              multiline
              placeholderTextColor={TEXT_COLORS.CAPTION_RED}
              value={content}
              onChangeText={setContent}
            />
          </View>
        </View>
  
        <View style={styles.informationContainer}>
          <View style={styles.remainTextContainer}>
            <Text style={[TYPOGRAPHY.SUBTITLE, styles.remainText]}>위치 선택</Text>
            <View style={styles.locationContainer}>
              <LocationMarkerSvg />
              <Text style={[TYPOGRAPHY.CAPTION_1, styles.locationText]}>{location}</Text>
            </View>
            <GoogleMapView />
          </View>
        </View>
  
        <View style={styles.buttonContainer}>
          <Button
            title="드롭핑 생성"
            onPress={handleCreateDropping}
            disabled={createDroppingMutation.isPending}
          />
        </View>
      </ScrollView>
    );
  }
  

export default DropScreen;