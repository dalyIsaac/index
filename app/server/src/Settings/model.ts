import { Settings, SettingsResult } from "@index/api/settings/schema";

import { addSeparator } from "@index/helpers";
import { homedir } from "os";
import path from "path";
import { promises } from "fs";
import { validateData } from "./validate";

const settingsPath = addSeparator(homedir(), path.sep) + ".index-settings.json";

const readSettings = async (): Promise<Settings> => {
  let data: Settings;
  try {
    const rawdata = await promises.readFile(settingsPath);
    data = JSON.parse(rawdata.toString());
  } catch (err) {
    console.error(err);
    // Create the non-existent file
    await promises.writeFile(settingsPath, JSON.stringify({ directory: "" }));
    data = { directory: "" };
  }

  return data;
};

export const getSettings = async (): Promise<SettingsResult> => {
  const data = await readSettings();
  const results = validateData(data);
  return results;
};

export const postSettings = async (
  data: Partial<Settings>,
): Promise<Partial<SettingsResult>> => {
  const result = await validateData(data, true);
  const errors: Partial<SettingsResult> = {};
  const settings = await readSettings();

  let key: keyof SettingsResult;
  for (key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const { value, error } = result[key];
      if (!error) {
        settings[key] = value;
      } else {
        errors[key] = { value, error };
      }
    }
  }

  await promises.writeFile(settingsPath, JSON.stringify(settings));

  return errors;
};
