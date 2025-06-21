import { readFileSync } from "fs";
import router from "../../../router";

router.on("/v2/docs", async function(_, response) {
    response.contentType = "text/html";
    response.response = readFileSync(process.cwd() + "/public/docs.html", "utf8");
});