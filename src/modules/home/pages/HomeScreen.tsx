import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { BACKGROUND_COLORS } from "../../../constants/colors";
import HeaderBar from "../components/HeaderBar";
import GoogleMapView from "../../../components/map/GoogleMapView";
import MusicWheel from "../components/MainFunction/MusicWheel";
import useLocation from "../../../hooks/useLocation";
import { useDroppings } from "../../drop/hooks/useDroppings";
import { usePlayerStore } from "../../../stores/playerStore";
import { useMemo } from "react";
import type { Dropping } from "../types/musicList";
import { getSongInfo, getDroppingById } from "../../drop/api/dropApi";
import { getDropLikeCount } from "../../music/api/likeApi";
import { getCommentsByDroppingId } from "../../music/api/commentApi";

function HomeScreen() {
  const { location } = useLocation();
  const currentLocation = location ?? { latitude: 37.5665, longitude: 126.9780 };
  const { currentId } = usePlayerStore();
  const mapRef = useRef<any>(null);

  const [currentSongData, setCurrentSongData] = useState<any>(null);

  useEffect(() => {
    console.log('HomeScreen - Current location:', currentLocation);
    console.log('Using location:', location ? '실제 GPS 위치' : '기본 위치 (서울시청)');
  }, [location, currentLocation]);

  const { data: droppings } = useDroppings(
    currentLocation.longitude,
    currentLocation.latitude
  );

  const currentDroppingId = useMemo(() => {
    if (!currentId || !Array.isArray(droppings)) return null;
    const found = droppings.find((d: Dropping) => String(d.songId) === String(currentId));
    return found ? found.droppingId : null;
  }, [currentId, droppings]);

  useEffect(() => {
    console.log('HomeScreen - 드랍핑 데이터 확인:', droppings?.length || 0, '개');
    if (droppings && droppings.length > 0) {
      console.log('첫 번째 드랍핑:', droppings[0]);
      console.log('모든 드랍핑 songId 목록:', droppings.map((d: Dropping) => ({ droppingId: d.droppingId, songId: d.songId })));
    }
  }, [droppings]);

  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log('[DEBUG] HomeScreen - 현재 재생 중인 음악 ID 변경:', {
      timestamp,
      currentId,
      type: typeof currentId,
      isNull: currentId === null,
      isUndefined: currentId === undefined
    });
  }, [currentId]);

  // WebView에 곡 데이터 전송
  useEffect(() => {
    if (mapRef.current && currentSongData) {
      const message = JSON.stringify({
        type: 'showNowPlayingCard',
        songData: currentSongData
      });
      mapRef.current.postMessage(message);
    } else if (mapRef.current && !currentSongData) {
      const message = JSON.stringify({
        type: 'hideNowPlayingCard'
      });
      mapRef.current.postMessage(message);
    }
  }, [currentSongData]);

  useEffect(() => {
    if (currentId && currentDroppingId) {
      const fetchCurrentSongData = async () => {
        try {
          console.log('현재 재생 중인 곡 정보 가져오기 시작:', { currentId, currentDroppingId });

          const droppingData = await getDroppingById(currentDroppingId);
          console.log('드랍핑 데이터:', droppingData);

          let songData = null;
          if (droppingData?.songId) {
            try {
              songData = await getSongInfo(droppingData.songId);
              console.log('곡 데이터:', songData);
            } catch (songError) {
              console.warn('곡 정보 가져오기 실패:', songError);
            }
          }

          let likeCount = 0;
          try {
            const likeData = await getDropLikeCount(currentDroppingId);
            likeCount = likeData.likeCount || 0;
            console.log('좋아요 수:', likeCount);
          } catch (likeError) {
            console.warn('좋아요 수 가져오기 실패:', likeError);
          }

          let commentCount = 0;
          try {
            const comments = await getCommentsByDroppingId(currentDroppingId);
            commentCount = Array.isArray(comments) ? comments.length : 0;
            console.log('댓글 수:', commentCount);
          } catch (commentError) {
            console.warn('댓글 수 가져오기 실패:', commentError);
          }

          const combinedData = {
            title: songData?.title || droppingData?.content || '재생 중인 곡',
            artist: songData?.artist || '알 수 없는 아티스트',
            albumImagePath: songData?.albumImagePath,
            content: droppingData?.content,
            address: droppingData?.address,
            likeCount: likeCount,
            commentCount: commentCount,
          };

          setCurrentSongData(combinedData);

        } catch (error) {
          console.error('현재 재생 중인 곡 정보 가져오기 실패:', error);
        }
      };

      fetchCurrentSongData();
    } else {
      setCurrentSongData(null);
    }
  }, [currentId, currentDroppingId]);

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLORS.BACKGROUND }}>
        <View style={{ flex: 1, position: 'relative' }}>
            <GoogleMapView
                ref={mapRef}
                droppings={Array.isArray(droppings) ? droppings : []}
                currentLocation={currentLocation}
                currentPlayingDroppingId={currentDroppingId as any}
            />
            <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
                <HeaderBar />
            </SafeAreaView>

            <MusicWheel droppings={Array.isArray(droppings) ? droppings : []}/>
        </View>
    </View>

  );
}
export default HomeScreen;