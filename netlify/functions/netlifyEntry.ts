import app from "../../src/app";
import { Config } from "@netlify/functions";

export default app.netlifyHandler();

export const config: Config = {
  path: ["/*"]
};