import { Button, FormItem, Group, Spinner, Textarea } from "@vkontakte/vkui";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

export function CatFact() {
  const [catFact, setCatFact] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedByRequest, setUpdatedByRequest] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current && updatedByRequest && catFact) {
      const firstSpace = catFact.indexOf(" ");
      const position = firstSpace === -1 ? catFact.length : firstSpace;
      inputRef.current.setSelectionRange(position, position);
      inputRef.current.focus();
      setUpdatedByRequest(false);
    }
  }, [updatedByRequest, catFact]);

  async function handleButtonClick() {
    setLoading(true);
    const { fact } = await fetch("https://catfact.ninja/fact").then((resp) => resp.json());
    setLoading(false);
    setUpdatedByRequest(true);
    setCatFact(fact);
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setCatFact(e.currentTarget.value);
    setUpdatedByRequest(false);
  }

  return (
    <Group className={styles.group}>
      <FormItem htmlFor="input" className={styles.inputWrapper} noPadding>
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
