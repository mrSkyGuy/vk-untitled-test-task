import { useEffect, useCallback, useRef } from "react";
import { UseFormHandleSubmit } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { ageByNameApiClient } from "@shared/api";

export function useApi(
  name: string,
  handleSubmit: UseFormHandleSubmit<TFormInput, undefined>
): [TAgeByNameResponse | undefined, boolean, boolean, Error | null, () => Promise<void>] {
  const timeoutG = useRef<maybeNullish<number>>(null);
  const controller = useRef<maybeNullish<AbortController>>(null);

  const { data, isFetching, isError, refetch, error } = useQuery({
    queryKey: ["cat-fact", name],
    queryFn: async () => {
      if (controller.current) {
        controller.current.abort("Outdated request");
      }
      controller.current = new AbortController();
      const { signal } = controller.current;
      const response = await ageByNameApiClient.getAge(name, signal);
      return response;
    },
    enabled: false
  });

  const onSubmit = useCallback(async () => {
    if (data) return;
    if (timeoutG.current) {
      clearTimeout(timeoutG.current);
    }
    refetch();
  }, [refetch, data]);

  useEffect(() => {
    if (!name) return;

    const timeout = setTimeout(() => {
      handleSubmit(onSubmit)();
      clearTimeout(timeoutG.current!);
    }, 3000);
    timeoutG.current = timeout;

    return () => clearTimeout(timeout);
  }, [name, handleSubmit, onSubmit]);

  return [data, isFetching, isError, error, onSubmit];
}
