import { Button, FormItem, Group, Input } from "@vkontakte/vkui";

import { getValidAttributesForVKComponents } from "../helpers/";
import { useFormControlWithValidation, useApi } from "../hooks";
import { OutputResult } from "./OutputResult";
import styles from "./index.module.css";

export function AgeByName() {
  const [register, handleSubmit, name, validationErrors] = useFormControlWithValidation();
  const [data, isFetching, isError, requestError, onSubmit] = useApi(name, handleSubmit);

  return (
    <Group style={{ padding: "24px 16px", marginTop: "8px" }}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormItem
          bottom={
            validationErrors.name ? (
              <span className={styles.errorMessage}>{validationErrors.name.message}</span>
            ) : (
              <span>Let's guess your age :)</span>
            )
          }
          noPadding
          className={styles.inputWrapper}
        >
          <Input
            {...getValidAttributesForVKComponents(register("name"))}
            className={validationErrors.name ? styles.inputValidationError : ""}
            placeholder="type name..."
          />
        </FormItem>

        <div className={styles.bottomRow}>
          <div className={styles.result}>
            <OutputResult
              isError={isError}
              isFetching={isFetching}
              data={data}
              requestError={requestError}
            />
          </div>

          <Button
            type="submit"
            appearance={validationErrors.name ? "negative" : "positive"}
            disabled={!!validationErrors.name}
          >
            Get age
          </Button>
        </div>
      </form>
    </Group>
  );
}
