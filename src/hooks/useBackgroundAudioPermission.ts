import { useState, useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import TrackPlayer, { State } from 'react-native-track-player';

export const useBackgroundAudioPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestBackgroundAudioPermission = async () => {
    if (Platform.OS !== 'ios') {
      setHasPermission(true);
      return true;
    }

    setIsRequesting(true);
    
    try {
      Alert.alert(
        '백그라운드 재생 권한',
        '음악을 백그라운드에서 계속 재생하려면 권한이 필요합니다. 설정에서 "백그라운드 앱 새로고침"을 허용해주세요.',
        [
          {
            text: '나중에',
            style: 'cancel',
            onPress: () => {
              setHasPermission(false);
              setIsRequesting(false);
            }
          },
          {
            text: '설정으로 이동',
            onPress: () => {
              setHasPermission(true);
              setIsRequesting(false);
              if (Platform.OS === 'ios') {
                try {
                  Linking.openURL('App-Prefs:root=General&path=BACKGROUND_APP_REFRESH/Remedy');
                } catch (error) {
                  console.error('앱별 백그라운드 설정으로 이동 실패:', error);
                  try {
                    Linking.openURL('App-Prefs:root=General&path=BACKGROUND_APP_REFRESH');
                  } catch (error2) {
                    console.error('일반 백그라운드 설정으로 이동 실패:', error2);
                    Linking.openURL('App-Prefs:root=General');
                  }
                }
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('백그라운드 오디오 권한 요청 실패:', error);
      setHasPermission(false);
      setIsRequesting(false);
    }
  };

  const checkBackgroundAudioCapability = async () => {
    try {
      const state = await TrackPlayer.getState();
      console.log('TrackPlayer 상태:', state);
      setHasPermission(state !== State.Error && state !== State.None);
    } catch (error) {
      console.error('백그라운드 오디오 권한 확인 실패:', error);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    checkBackgroundAudioCapability();
  }, []);

  return {
    hasPermission,
    isRequesting,
    requestBackgroundAudioPermission,
    checkBackgroundAudioCapability
  };
};
