import { Home } from "@pages/Home";
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  SplitCol,
  SplitLayout,
  View
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

export function App() {
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout style={{ justifyContent: "center" }}>
            <SplitCol maxWidth={768}>
              <View activePanel="home">
                <Home id="home" />
              </View>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}
