import { useQuery } from "@tanstack/react-query";
import { getDroppings } from "../api/dropApi";

export function useDroppings(longitude: number, latitude: number) {
  return useQuery({
    queryKey: ["droppings", longitude, latitude],
    queryFn: () => getDroppings({ longitude, latitude }),
    enabled: longitude !== undefined && latitude !== undefined,
  });
}