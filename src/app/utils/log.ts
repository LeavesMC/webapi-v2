import { getLogger } from "log4js";
import env from "./env";

const logger = getLogger();

logger.level = env.logLevel;

export { logger };