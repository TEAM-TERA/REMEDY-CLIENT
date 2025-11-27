import { useQuery } from "@tanstack/react-query";
import { getDroppings } from "../api/dropApi";

export function useDroppings(longitude: number, latitude: number, distance: number = 1000) {
  // GPS 지터 문제 해결: 좌표를 3자리 소수점으로 반올림 (약 111m 정확도)
  const roundedLon = Math.round(longitude * 1000) / 1000;
  const roundedLat = Math.round(latitude * 1000) / 1000;

  return useQuery({
    queryKey: ["droppings", roundedLon, roundedLat, distance],
    queryFn: () => getDroppings({ longitude, latitude, distance }),
    enabled: longitude !== undefined && latitude !== undefined,
    staleTime: 30 * 1000, // 30초 동안 fresh 상태 유지
    refetchOnWindowFocus: true, // 앱이 포커스를 받을 때 새로고침
    refetchOnMount: true, // 컴포넌트 마운트 시 새로고침
  });
}