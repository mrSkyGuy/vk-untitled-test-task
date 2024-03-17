import { Spinner } from "@vkontakte/vkui";
import styles from "./index.module.css";

type TOutputResultProps = {
  isError: boolean;
  isFetching: boolean;
  requestError: Error | null;
  data: TAgeByNameResponse | undefined;
};

export function OutputResult({ isError, requestError, isFetching, data }: TOutputResultProps) {
  if (isError && !(requestError instanceof DOMException && requestError.name === "AbortError")) {
    return (
      <span className={styles.errorMessage}>An error has occurred. Please try again later</span>
    );
  }

  if (isFetching) {
    return <Spinner className={styles.spinner} size="regular" />;
  } else {
    switch (data?.age) {
      case null:
        return <span>I don't know this name :(</span>;
      case undefined:
        return <span></span>;
      default:
        return <span>{data!.age}</span>;
    }
  }
}
