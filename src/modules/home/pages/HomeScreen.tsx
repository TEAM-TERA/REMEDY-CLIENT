import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { useQueryClient } from "@tanstack/react-query";

function HomeScreen() {
  const { location } = useLocation();
  const queryClient = useQueryClient();

  const defaultLocation = useMemo(() => ({ latitude: 37.5665, longitude: 126.9780 }), []);
  
  // GPS 떨림 방지: 의미있는 위치 변화만 반영 (약 100m 이상)
  const stableLocation = useMemo(() => {
    if (!location) return defaultLocation;
    
    // 소수점 3자리로 반올림 (약 111m 정확도)
    const roundedLat = Math.round(location.latitude * 1000) / 1000;
    const roundedLng = Math.round(location.longitude * 1000) / 1000;
    
    return { latitude: roundedLat, longitude: roundedLng };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.latitude, location?.longitude, defaultLocation]);
  
  const currentLocation = stableLocation;
  const { currentId, setCurrentId, playIfDifferent } = usePlayerStore();
  const mapRef = useRef<any>(null);

  const [currentSongData, setCurrentSongData] = useState<any>(null);
  const isInitialLoad = useRef(true);

  const { data: droppings } = useDroppings(
    currentLocation.longitude,
    currentLocation.latitude,
    1000  // 1km 반경 내 드랍핑 조회
  );

  const [selectedDroppingId, setSelectedDroppingId] = useState<string | undefined>(undefined);

  const handleDroppingChange = useCallback(async (droppingId: string | undefined, songId: string | undefined) => {

    setSelectedDroppingId(droppingId);

    if (songId && droppingId) {
      try {
        let songMeta = {
          title: '재생 중인 음악',
          artist: '아티스트',
          artwork: undefined as string | undefined
        };

        try {
          const songInfo = await getSongInfo(songId);
          if (songInfo) {
            songMeta = {
              title: songInfo.title || '재생 중인 음악',
              artist: songInfo.artist || '알 수 없는 아티스트',
              artwork: songInfo.albumImagePath
            };
          }
        } catch (songInfoError) {
          console.warn('getSongInfo 실패, 기본값 사용:', songInfoError);
        }

        if (isInitialLoad.current) {
          isInitialLoad.current = false;
        }

        await playIfDifferent(songId, songMeta, true);
      } catch (error) {
        console.error('음악 재생 실패:', songId, error);
      }
    } else {
      setCurrentId(null);
    }
  }, [setCurrentId, playIfDifferent]);
  
  const currentDroppingId = useMemo(() => {
    if (selectedDroppingId) {
      return selectedDroppingId;
    }

    if (!currentId || !Array.isArray(droppings)) {
      return null;
    }

    let found = droppings.find((d: any) => String(d.songId) === String(currentId));

    if (!found) {
      found = droppings.find((d: any) =>
        d.type === 'VOTE' &&
        Array.isArray(d.options) &&
        d.options.some((optionId: string) => String(optionId) === String(currentId))
      );
    }

    return found ? found.droppingId : null;
  }, [currentId, droppings, selectedDroppingId]);

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
  }, [currentSongData, currentDroppingId]);

  useEffect(() => {
    if (currentId && currentDroppingId) {
      const fetchCurrentSongData = async () => {
        try {
          const localDropping = droppings?.find((d: Dropping) => String(d.droppingId) === String(currentDroppingId));

          let droppingData = localDropping;
          if (!droppingData) {
            try {
              droppingData = await getDroppingById(String(currentDroppingId));
            } catch (apiError) {
              console.warn('API 호출 실패, 로컬 데이터 사용:', apiError);
              droppingData = localDropping;
            }
          }

          let songData = null;
          if (droppingData?.songId) {
            try {
              songData = await getSongInfo(droppingData.songId);
            } catch (songError) {
              console.warn('곡 정보 가져오기 실패:', songError);
            }
          }

          let likeCount = 0;
          try {
            const likeData = await getDropLikeCount(currentDroppingId);
            likeCount = likeData.likeCount || 0;
          } catch (likeError) {
            console.warn('좋아요 수 가져오기 실패:', likeError);
          }

          let commentCount = 0;
          try {
            const comments = await getCommentsByDroppingId(currentDroppingId);
            commentCount = Array.isArray(comments) ? comments.length : 0;
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
  }, [currentId, currentDroppingId, droppings]);

  // 홈 화면에 포커스가 올 때 droppings 데이터를 새로고침
  useFocusEffect(
    useCallback(() => {
      console.log('🏠 HomeScreen focused: Refetching droppings data');
      // 위치 기반 droppings 쿼리를 새로고침
      queryClient.refetchQueries({
        queryKey: ["droppings", currentLocation.longitude, currentLocation.latitude],
        exact: false
      });
    }, [queryClient, currentLocation.longitude, currentLocation.latitude])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLORS.BACKGROUND }} edges={['bottom']}>
        <View style={{ flex: 1, position: 'relative' }}>
            <GoogleMapView
                ref={mapRef}
                droppings={Array.isArray(droppings) ? droppings : []}
                currentLocation={currentLocation}
                currentPlayingDroppingId={currentDroppingId as any}
            />
            <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }} edges={['top']}>
                <HeaderBar />
            </SafeAreaView>

            <MusicWheel
              droppings={Array.isArray(droppings) ? droppings : []}
              onDroppingChange={handleDroppingChange}
            />
        </View>
    </SafeAreaView>

  );
}
export default HomeScreen;