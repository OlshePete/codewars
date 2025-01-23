export const filterUndefinedPaths = (paths: (string | undefined)[]): string[] => {
  return paths.filter((p) => p !== undefined) as string[];
};
