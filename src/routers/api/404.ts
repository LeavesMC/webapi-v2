import router from "../router";

router.on("/404/", async function(data, response) {
    response.contentType = "application/json";
    response.status = 404;
    response.response = {
        code: 404,
        msg: "Not Found"
    };
});