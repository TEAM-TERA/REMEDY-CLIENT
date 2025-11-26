import { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // 백엔드에서 온 에러 메시지 우선 사용
    const backendMessage = error.response?.data?.message || error.response?.data?.error;
    if (backendMessage) {
      return backendMessage;
    }

    // HTTP 상태 코드별 기본 메시지
    switch (error.response?.status) {
      case 400:
        return '잘못된 요청입니다.';
      case 401:
        return '인증이 필요합니다.';
      case 403:
        return '권한이 없습니다.';
      case 404:
        return '요청한 정보를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다.';
      default:
        return '네트워크 오류가 발생했습니다.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

export function handleApiError(error: unknown): never {
  const message = getErrorMessage(error);
  throw new Error(message);
}