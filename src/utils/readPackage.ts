import * as path from "path";

export const filePath = path.resolve(__dirname, "../../package.json");
export const packageJson = require(filePath);

export const getPackageName = () => {
  const { name } = packageJson;
  return name as string;
};
