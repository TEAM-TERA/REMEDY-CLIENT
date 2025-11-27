import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDropping } from "../api/dropApi";

export function useCreateDropping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDropping,
    onSuccess: () => {
      // 모든 droppings 관련 쿼리를 정확히 무효화 (부분 키 매칭 사용)
      queryClient.invalidateQueries({
        queryKey: ["droppings"],
        exact: false
      });
      queryClient.invalidateQueries({ queryKey: ["myDrops"] });
      console.log('✅ Drop created: Cache invalidated for droppings queries');
    },
  });
}