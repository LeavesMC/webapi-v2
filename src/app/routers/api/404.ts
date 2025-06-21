import router from "../../router.ts";
import restUtils from "../../utils/restUtils.ts";

router.on("/404/", async function(_, response) {
    restUtils.$404(response);
});