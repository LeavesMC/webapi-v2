import router from "../../router";
import { readFileSync } from "fs";

router.on("/v2/api", async function(request, response) {
    response.contentType = "application/json";
    response.response = readFileSync(process.cwd() + "/public/API-V2.json");
})
