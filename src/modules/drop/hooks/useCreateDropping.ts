import { useMutation } from "@tanstack/react-query";
import { createDropping } from "../api/dropApi";

export function useCreateDropping() {
  return useMutation({
    mutationFn: createDropping,
  });
}