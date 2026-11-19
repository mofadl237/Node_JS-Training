import { cacheLife } from "next/cache";

export const getCurrentYear = async (): Promise<number> => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};
