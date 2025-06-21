import { readFileSync } from "fs";
import router from "../../../router.ts";

router.on("/v2/api", async function(_, response) {
    response.contentType = "application/yaml";
    response.response = readFileSync(process.cwd() + "/public/api-v2.json", "utf8");
});