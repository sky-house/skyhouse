import { useMemo } from "react";

export const useUniqueString = (strong = 1000): string => {
  const uniqueString = useMemo(() => {
    return (
      new Date().getTime().toString(16) +
      Math.floor(strong * Math.random()).toString(16)
    );
  }, [strong]);

  return uniqueString;
};
