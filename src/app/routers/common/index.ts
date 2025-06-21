import router from "../../router.ts";

router.on("/", async function(_, response) {
    response.redirect = true;
    response.redirectUrl = "/v2/docs";
});