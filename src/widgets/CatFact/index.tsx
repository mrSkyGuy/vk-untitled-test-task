import { Button, FormItem, Group, Input, Spinner } from "@vkontakte/vkui";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export function CatFact() {
  const [catFact, setCatFact] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedByRequest, setUpdatedByRequest] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setCatFact(e.currentTarget.value);
    setUpdatedByRequest(false);
  }

  return (
    <Group style={{ display: "flex", gap: "8px", padding: "24px 16px", marginTop: "8px" }}>
      <FormItem htmlFor="input" style={{ flex: "1" }} noPadding>
        <Input getRef={inputRef} id="input" value={catFact} onChange={handleChange} />
      </FormItem>
      <Button
        appearance="positive"
        style={{ flex: "0" }}
        disabled={loading}
        onClick={handleButtonClick}
      >
        {!loading && "Get fact"}
        {loading && <Spinner size="small" />}
      </Button>
    </Group>
  );
}
