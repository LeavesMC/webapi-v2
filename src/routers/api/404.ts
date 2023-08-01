import router from "../router";
import Utils from  "../../utils/utils"

router.on("/404/", async function(data, response) {
    Utils.return404(response);
});