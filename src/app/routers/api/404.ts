import router from "../../router";
import restUtils from "../../utils/restUtils";

router.on("/404/", async function(_, response) {
    restUtils.$404(response);
});