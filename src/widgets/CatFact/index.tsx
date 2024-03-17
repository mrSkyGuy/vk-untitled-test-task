import { Button, FormItem, Group, Spinner, Textarea } from "@vkontakte/vkui";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { catFactApiClient } from "@shared/api";

export function CatFact() {
  const [catFact, setCatFact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<maybeNullish<string>>(null);

  const updatedByRequest = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current && updatedByRequest.current && catFact) {
      const firstSpace = catFact.indexOf(" ");
      const position = firstSpace === -1 ? catFact.length : firstSpace;
      inputRef.current.setSelectionRange(position, position);
      inputRef.current.focus();
      updatedByRequest.current = false;
    }
  }, [updatedByRequest, catFact]);

  async function handleButtonClick() {
    setLoading(true);
    try {
      const { fact } = await catFactApiClient.getFact();
      updatedByRequest.current = true;
      setCatFact(fact);
      setError(null);
    } catch (error) {
      setError("An error has occurred. Please try again later");
    }
    setLoading(false);
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setCatFact(e.currentTarget.value);
    updatedByRequest.current = false;
  }

  return (
    <Group className={styles.group}>
      <FormItem
        bottom={error ? <span className={styles.errorMessage}>{error}</span> : "Fancy cat facts"}
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
        disabled={loading}
        onClick={handleButtonClick}
        appearance="positive"
        className={styles.button}
      >
        {!loading && "Get fact"}
        {loading && <Spinner size="small" />}
      </Button>
    </Group>
  );
}
