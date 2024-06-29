import router from "../router";

router.on("/", async function(_data, response) {
    response.redirect = true;
    response.redirectUrl = "/v2/docs";
});