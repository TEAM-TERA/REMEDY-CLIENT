import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDropping } from "../api/dropApi";
import { Alert } from "react-native";

export function useDeleteDropping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (droppingId: string) => deleteDropping(droppingId),
    onSuccess: () => {
      // 드랍핑 목록 쿼리 무효화하여 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ["droppings"]
      });

      Alert.alert("완료", "드랍핑이 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("드랍핑 삭제 실패:", error);
      Alert.alert("오류", "드랍핑 삭제에 실패했습니다. 다시 시도해주세요.");
    },
  });
}