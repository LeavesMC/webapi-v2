import router from "../../router";

router.on("/", async function(_, response) {
    response.redirect = true;
    response.redirectUrl = "/v2/docs";
});