import { useEffect, useRef } from "react";

export function useUpdateEffect(callback: () => void, deps: unknown[]) {
  const hasMount = useRef(false);

  useEffect(() => {
    if (hasMount.current) {
      callback();
    } else {
      hasMount.current = true;
    }
    // eslint-disable-next-line
  }, [...deps]);
}
