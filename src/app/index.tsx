import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  SplitCol,
  SplitLayout,
  View
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import { Home } from "@pages/Home";

export function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: 1,
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <QueryClientProvider client={queryClient}>
            <SplitLayout style={{ justifyContent: "center" }}>
              <SplitCol maxWidth={768}>
                <View activePanel="home">
                  <Home id="home" />
                </View>
              </SplitCol>
            </SplitLayout>
          </QueryClientProvider>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}
