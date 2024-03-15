import { Button, FormItem, Group, Input } from "@vkontakte/vkui";
import { useRef } from "react";

export function CatFact() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Group style={{ display: "flex", gap: "8px", padding: "24px 16px", marginTop: "8px" }}>
      <FormItem htmlFor="cat-fact-input" style={{ flex: "1" }} noPadding>
        <Input getRef={inputRef} id="cat-fact-input" />
      </FormItem>
      <Button appearance="positive" style={{ flex: "0" }}>
        Get fact
      </Button>
    </Group>
  );
}
