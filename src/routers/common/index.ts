import router from "../router";

router.on("/", async function(_data, response) {
    response.response = "LeavesMC API";
});