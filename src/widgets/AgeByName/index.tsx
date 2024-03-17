import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormItem, Group, Input, Spinner } from "@vkontakte/vkui";
import { useRef, useEffect, useCallback } from "react";
import { RefCallBack, UseFormRegisterReturn, useForm } from "react-hook-form";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";

import styles from "./index.module.css";
import { ageByNameApiClient } from "@shared/api";

type TFormInput = {
  name: string;
};

const schema = yup.object().shape({
  name: yup
    .string()
    .required("You cannot send empty field")
    .matches(/^[A-Za-z]+$/gu, "You must use latin letters")
    .min(2, "Name must be no shorter than 2 letters long")
    .max(30, "Name must be no longer than 30 letters long")
});

export function AgeByName() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<TFormInput>({ resolver: yupResolver(schema) });
  const name = watch("name");

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

  function getValidAttributesForVKComponents<T extends string>(
    reg: UseFormRegisterReturn<T>
  ): UseFormRegisterReturn | { getRef: RefCallBack; ref: null } {
    return {
      ...reg,
      getRef: reg.ref,
      ref: null
    };
  }

  function getOutputResult() {
    if (isError && !(error instanceof DOMException && error.name === "AbortError")) {
      return (
        <span className={styles.errorMessage}>An error has occurred. Please try again later</span>
      );
    }

    if (isFetching) {
      return <Spinner className={styles.spinner} size="regular" />;
    } else {
      switch (data?.age) {
        case null:
          return <span>I don't know this name :(</span>;
        case undefined:
          return <span></span>;
        default:
          return <span>{data!.age}</span>;
      }
    }
  }

  return (
    <Group style={{ padding: "24px 16px", marginTop: "8px" }}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormItem
          bottom={
            errors.name ? (
              <span className={styles.errorMessage}>{errors.name.message}</span>
            ) : (
              <span>Let's guess your age :)</span>
            )
          }
          noPadding
          className={styles.inputWrapper}
        >
          <Input
            {...getValidAttributesForVKComponents(register("name"))}
            className={errors.name ? styles.inputValidationError : ""}
            placeholder="type name..."
          />
        </FormItem>

        <div className={styles.bottomRow}>
          <div className={styles.result}>{getOutputResult()}</div>

          <Button
            type="submit"
            appearance={errors.name ? "negative" : "positive"}
            disabled={!!errors.name}
          >
            Get age
          </Button>
        </div>
      </form>
    </Group>
  );
}
