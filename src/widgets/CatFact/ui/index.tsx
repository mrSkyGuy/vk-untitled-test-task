import { Button, FormItem, Group, Spinner, Textarea } from "@vkontakte/vkui";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { catFactApiClient } from "@shared/api";
import { useQuery } from "@tanstack/react-query";

export function CatFact() {
  const [catFact, setCatFact] = useState("");
  const updatedByRequest = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { isFetching, isError, refetch } = useQuery({
    queryKey: ["cat-fact"],
    queryFn: async () => {
      const response = await catFactApiClient.getFact();
      updatedByRequest.current = true;
      setCatFact(response.fact);
      return response;
    },
    enabled: false
  });

  useEffect(() => {
    if (inputRef.current && updatedByRequest.current && catFact) {
      const firstSpace = catFact.indexOf(" ");
      const position = firstSpace === -1 ? catFact.length : firstSpace;
      inputRef.current.setSelectionRange(position, position);
      inputRef.current.focus();
      updatedByRequest.current = false;
    }
  }, [catFact]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setCatFact(e.currentTarget.value);
    updatedByRequest.current = false;
  }

  return (
    <Group className={styles.group}>
      <FormItem
        bottom={
          isError ? (
            <span className={styles.errorMessage}>
              An error has occurred. Please try again later
            </span>
          ) : (
            "Fancy cat facts"
          )
        }
        htmlFor="input"
        className={styles.inputWrapper}
        noPadding
      >
        <Textarea
          className={styles.textArea}
          getRef={inputRef}
          id="input"
          value={catFact}
          onChange={handleChange}
          placeholder="press on green button..."
        />
      </FormItem>
      <Button
        disabled={isFetching}
        onClick={() => refetch()}
        appearance="positive"
        className={styles.button}
      >
        {!isFetching && "Get fact"}
        {isFetching && <Spinner size="small" />}
      </Button>
    </Group>
  );
}
