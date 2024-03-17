import { RefCallBack, UseFormRegisterReturn } from "react-hook-form";

export function getValidAttributesForVKComponents<T extends string>(
  reg: UseFormRegisterReturn<T>
): UseFormRegisterReturn | { getRef: RefCallBack; ref: null } {
  return {
    ...reg,
    getRef: reg.ref,
    ref: null
  };
}
