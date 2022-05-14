const firstOrSelf: <T>(input: T | T[]) => T | undefined = (input) =>
  Array.isArray(input) ? input[0] : input;

export default firstOrSelf;
