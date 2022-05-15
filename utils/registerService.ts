// Taken from https://dev.to/noclat/fixing-too-many-connections-errors-with-database-clients-stacking-in-dev-mode-with-next-js-3kpm
export const registerService = <T>(name: string, initFn: () => T) => {
  if (process.env.NODE_ENV === "development") {
    if (!(name in globalThis)) {
      // @ts-ignore
      globalThis[name] = initFn();
    }
    // @ts-ignore
    return globalThis[name] as T;
  }
  return initFn();
};
