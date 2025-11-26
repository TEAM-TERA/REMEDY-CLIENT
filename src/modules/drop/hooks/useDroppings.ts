import { useQuery } from "@tanstack/react-query";
import { getDroppings } from "../api/dropApi";

export function useDroppings(longitude: number, latitude: number, distance: number = 1000) {
  return useQuery({
    queryKey: ["droppings", longitude, latitude, distance],
    queryFn: () => getDroppings({ longitude, latitude, distance }),
    enabled: longitude !== undefined && latitude !== undefined,
  });
}