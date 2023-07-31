import router from "../../router";
import { buildInRouters } from "vclight-router";

router.on("/404/", async function(data, response) {
    if ((<string>data.url).startsWith("/api/")) {
        response.contentType = "application/json";
        response.status = 404;
        response.response = {
            code: 404,
            msg: "Not Found"
        };
    } else {
        await buildInRouters.error404(data, response);
    }
});