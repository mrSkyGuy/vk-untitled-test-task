import { useState } from "react";
import { Panel, PanelHeader } from "@vkontakte/vkui";
import { Tabs, CatFact } from "@widgets";

type THomeProps = {
  id: string;
};

export function Home({ id }: THomeProps) {
  const [selected, setSelected] = useState<"cat-facts" | "age-by-name">("cat-facts");

  return (
    <Panel id={id}>
      <PanelHeader>Home Page</PanelHeader>
      <Tabs selected={selected} setSelected={setSelected} />
      {selected === "cat-facts" && <CatFact />}
    </Panel>
  );
}
