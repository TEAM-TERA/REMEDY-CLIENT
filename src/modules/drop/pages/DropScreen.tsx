import { View, Text, TextInput, ScrollView, Image } from 'react-native';
import { useState, useEffect, useContext, useRef } from 'react';
import { styles } from '../styles/DropScreen';
import { TYPOGRAPHY } from '../../../constants/typography';
import { TEXT_COLORS } from '../../../constants/colors';
import PlayBar from '../../../components/playBar/PlayBar';
import CdPlayer from '../../../components/cdPlayer/CdPlayer';
import LocationMarkerSvg from '../components/LocationMarker/LocationMarkerSvg';
import GoogleMapView from '../../../components/map/GoogleMapView';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { DropStackParamList } from '../../../navigation/DropStack';
import { useCreateDropping } from '../hooks/useCreateDropping';
import { AuthContext } from '../../auth/auth-context';
import Button from '../../../components/button/Button';
import Geolocation from 'react-native-geolocation-service';
import { useQuery } from '@tanstack/react-query';
import { getSongInfo } from '../api/dropApi';
import { useHLSPlayer } from '../../../hooks/music/useHLSPlayer';
import useLocation from '../../../hooks/useLocation';
import { isPlaying } from 'react-native-track-player';
import { ConfirmModal } from '../../../components';

function DropScreen() {
    const route = useRoute<RouteProp<DropStackParamList, 'DropDetail'>>();
    const navigation = useNavigation();
    const { musicTitle, singer, musicTime, location, imgUrl, previewUrl, songId } = route.params;
    const { location: userLocation } = useLocation();
    const { userToken } = useContext(AuthContext);
    const createDroppingMutation = useCreateDropping();
  
    const [content, setContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const confirmActionRef = useRef<(() => void) | null>(null);
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const musicPlayer = useHLSPlayer(songId);
    const serverImageUrl = Image.resolveAssetSource(require('../../../assets/images/normal_music.png')).uri;
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
        setModalTitle('로그인 필요');
        setModalMessage('드롭핑을 생성하려면 로그인이 필요합니다.');
        confirmActionRef.current = null;
        setModalVisible(true);
        return;
      }

      if (!currentLocation) {
        setModalTitle('위치 오류');
        setModalMessage('위치 정보를 가져올 수 없습니다. 다시 시도해주세요.');
        confirmActionRef.current = null;
        setModalVisible(true);
        return;
      }

      if (!songId) {
        setModalTitle('음악 오류');
        setModalMessage('음악 정보를 찾을 수 없습니다.');
        confirmActionRef.current = null;
        setModalVisible(true);
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
            setModalTitle('성공');
            setModalMessage('드롭핑이 성공적으로 생성되었습니다!');
            confirmActionRef.current = () => navigation.navigate('Home' as any);
            setModalVisible(true);
          },
          onError: (err: any) => {
            console.log('드롭핑 생성 실패:', err);
            setModalTitle('경고');
            setModalMessage('근처에 드롭핑이 있습니다. 다른 위치에 드롭핑을 생성해주세요.');
            confirmActionRef.current = null;
            setModalVisible(true);
          },
        }
      );
    };
  
    return (
      <>
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
            <GoogleMapView droppings={[]} currentLocation={currentLocation || { latitude: 37.5665, longitude: 126.9780 }} />
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
      <ConfirmModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        cancelText="취소"
        confirmText="확인"
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          if (confirmActionRef.current) {
            confirmActionRef.current();
            confirmActionRef.current = null;
          }
        }}
      />
      </>
    );
  }
  

export default DropScreen;