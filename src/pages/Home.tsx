import { useState } from "react";
import { Panel, PanelHeader } from "@vkontakte/vkui";
import { Tabs } from "@widgets/Tabs";

type THomeProps = {
  id: string;
};

export function Home({ id }: THomeProps) {
  const [selected, setSelected] = useState<"cat-facts" | "age-by-name">("cat-facts");

  return (
    <Panel id={id}>
      <PanelHeader>Home Page</PanelHeader>
      <Tabs selected={selected} setSelected={setSelected} />
    </Panel>
  );
}
