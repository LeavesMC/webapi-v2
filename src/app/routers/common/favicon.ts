import router from "../../router";
import { readFileSync } from "fs";

router.on("/favicon.ico", async function(_, response) {
    response.contentType = "image/x-icon";
    response.response = readFileSync(process.cwd() + "/public/favicon.ico", "utf-8");
});
