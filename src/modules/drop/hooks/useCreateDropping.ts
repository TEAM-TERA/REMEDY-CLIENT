import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDropping } from "../api/dropApi";

export function useCreateDropping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDropping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["droppings"] });
      queryClient.invalidateQueries({ queryKey: ["myDrops"] });
    },
  });
}