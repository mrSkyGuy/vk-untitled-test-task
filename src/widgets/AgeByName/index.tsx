import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormItem, Group, Input, Spinner } from "@vkontakte/vkui";
import { useEffect, useRef, useState } from "react";
import { RefCallBack, UseFormRegisterReturn, useForm } from "react-hook-form";
import * as yup from "yup";
// eslint-disable-next-line import/named
import axios, { CancelTokenSource } from "axios";
import styles from "./index.module.css";

type TFormInput = {
  name: string;
};

type TResponse = {
  age: number;
  count: number;
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
  const [age, setAge] = useState<null | undefined | number>();
  const [requestedName, setRequestedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null);
  const [error, setError] = useState<null | string>(null);
  const timeoutG = useRef<number | null>(null);

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

    if (!name || requestedName === name) return;
    setRequestedName(name);
    setLoading(true);

    if (cancelTokenSource) {
      cancelTokenSource.cancel("Request canceled");
    }

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      const newCancelTokenSource = axios.CancelToken.source();
      const respAge = await axios
        .get<TResponse>(`https://api.agify.io/?name=${name}`, {
          cancelToken: newCancelTokenSource.token
        })
        .then(({ data }) => data.age);

      setCancelTokenSource(newCancelTokenSource);
      setAge(respAge);
    } catch (error) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (!axios.isCancel(error)) {
        setError(`${error}`);
      }
    }
    setLoading(false);
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

  function resultOutput() {
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
          top="Name"
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
            placeholder="type here..."
          />
        </FormItem>

        <div className={styles.bottomRow}>
          <div className={styles.result}>{resultOutput()}</div>

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
