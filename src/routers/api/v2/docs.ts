import router from "../../router";
import { readFileSync } from "fs";

router.on("/v2/docs", async function(request, response) {
    response.contentType = "text/html";
    response.response = readFileSync(process.cwd() + "/public/docs.html");
})
