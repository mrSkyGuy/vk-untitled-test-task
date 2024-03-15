import { Dispatch, SetStateAction } from "react";
import { TabsItem, Tabs as VKTabs } from "@vkontakte/vkui";

type TTabsProps = {
  selected: "cat-facts" | "age-by-name";
  setSelected: Dispatch<SetStateAction<"cat-facts" | "age-by-name">>;
};

export function Tabs({ selected, setSelected }: TTabsProps) {
  return (
    <VKTabs>
      <TabsItem
        selected={selected === "cat-facts"}
        onClick={() => setSelected("cat-facts")}
        id="tab-cat-facts"
        aria-controls="tab-content-cat-facts"
      >
        Cat facts
      </TabsItem>
      <TabsItem
        selected={selected === "age-by-name"}
        onClick={() => setSelected("age-by-name")}
        id="tab-age-by-name"
        aria-controls="tab-content-age-by-name"
      >
        Age by name
      </TabsItem>
    </VKTabs>
  );
}
