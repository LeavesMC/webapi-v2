import router from "../router";
import restError from "../../utils/restError";

router.on("/404/", async function(data, response) {
    restError.$404(response);
});