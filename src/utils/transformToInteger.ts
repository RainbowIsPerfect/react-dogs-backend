export const transformToInteger = (val: string, defaultVal: string) => {
  const parsedInt = parseInt(val);

  if (Number.isNaN(parsedInt) || parsedInt <= 0) {
    return defaultVal;
  }

  return String(parsedInt);
};
