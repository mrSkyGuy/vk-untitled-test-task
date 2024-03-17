import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormItem, Group, Input, Spinner } from "@vkontakte/vkui";
import { useEffect, useRef, useState } from "react";
import { RefCallBack, UseFormRegisterReturn, useForm } from "react-hook-form";
import * as yup from "yup";
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

  const [age, setAge] = useState<maybeNullish<number>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<maybeNullish<string>>(null);

  const requestedName = useRef("");
  const timeoutG = useRef<maybeNullish<number>>(null);
  const controller = useRef<maybeNullish<AbortController>>(null);

  const name = watch("name");
  useEffect(() => {
    if (!name) return;

    const timeout = setTimeout(() => {
      handleSubmit(onSubmit)();
      clearTimeout(timeoutG.current!);
    }, 3000);
    timeoutG.current = timeout;

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, handleSubmit]);

  async function onSubmit() {
    if (timeoutG.current) {
      clearTimeout(timeoutG.current);
    }

    if (!name || requestedName.current === name) return;
    requestedName.current = name;
    setLoading(true);

    if (controller.current && !controller.current.signal.aborted) {
      controller.current.abort("Outdated request");
    }
    controller.current = new AbortController();
    const { signal } = controller.current;

    try {
      const { age } = await ageByNameApiClient.getAge(name, signal);

      setAge(age);
      setError(null);
      setLoading(false);
    } catch {
      if (signal.reason === "Outdated request") {
        setError(null);
      } else {
        setError("An error has occurred. Please try again later");
        setLoading(false);
      }
    }
  }

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
    if (error) {
      return <span className={styles.errorMessage}>{error}</span>;
    }

    if (loading) {
      return <Spinner className={styles.spinner} size="regular" />;
    } else {
      switch (age) {
        case null:
          return <span>I don't know this name :(</span>;
        case undefined:
          return <span></span>;
        default:
          return <span>{age}</span>;
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
