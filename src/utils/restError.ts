import { ResponseContext } from "vclight-router";

class RestError {
    $400(response: ResponseContext) {
        response.contentType = "application/json";
        response.status = 400;
        response.response = {
            code: 400,
            msg: "Bad Request"
        };
    }

    $401(response: ResponseContext) {
        response.contentType = "application/json";
        response.status = 401;
        response.response = {
            code: 401,
            msg: "Unauthorized"
        };
    }

    $404(response: ResponseContext) {
        response.contentType = "application/json";
        response.status = 404;
        response.response = {
            code: 404,
            msg: "Not Found"
        };
    }

    $500(response: ResponseContext) {
        response.contentType = "application/json";
        response.status = 500;
        response.response = {
            code: 500,
            msg: "An error occurred"
        };
    }
}

const restError = new RestError();
export default restError;