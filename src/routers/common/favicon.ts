import { readFileSync } from "fs";
import router from "../router";

router.on("/favicon.ico", async function(data, response) {
    response.contentType = "image/x-icon";
    response.response = readFileSync(process.cwd() + "/public/favicon.ico");
})
