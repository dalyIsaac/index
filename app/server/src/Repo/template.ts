import { addSeparator, writeNewFile } from "@index/helpers";

import path from "path";

export const getFolders = (repoPath: string, date: Date) => {
  repoPath = addSeparator(repoPath, path.sep);

  const year = date.getUTCFullYear();
  const yearFolder = repoPath + year;

  const month = date.getUTCMonth() + 1;
  const monthFolder = addSeparator(yearFolder, path.sep) + month;

  const day = date.getUTCDate();
  const dayFile = addSeparator(monthFolder, path.sep) + day + ".json";

  return { yearFolder, monthFolder, dayFile };
};

export const addReadme = async (repoPath: string): Promise<void> => {
  const readme = addSeparator(repoPath, path.sep) + "README.md";
  await writeNewFile(readme, "Hello Index!");
};
