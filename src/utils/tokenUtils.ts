import AsyncStorage from '@react-native-async-storage/async-storage';


export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('토큰 파싱 에러:', error);
    return true;
  }
};

export const shouldRefreshToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const refreshThreshold = 5 * 60;
    
    return (payload.exp - currentTime) < refreshThreshold;
  } catch (error) {
    console.error('토큰 파싱 에러:', error);
    return true;
  }
};

export const checkTokenStatus = async (): Promise<{
  isValid: boolean;
  needsRefresh: boolean;
  token: string | null;
}> => {
  const token = await AsyncStorage.getItem('userToken');
  
  if (!token) {
    return { isValid: false, needsRefresh: false, token: null };
  }
  
  const expired = isTokenExpired(token);
  const needsRefresh = shouldRefreshToken(token);
  
  return {
    isValid: !expired,
    needsRefresh,
    token
  };
};
