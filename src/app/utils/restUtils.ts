import { ResponseContext } from "@vclight/router";

class RestUtils {
    $200(response: ResponseContext, data: any = null) {
        response.contentType = "application/json";
        response.status = 200;
        response.response = {
            code: 200,
            ...data,
        };
    }

    $400(response: ResponseContext, msg?: string) {
        response.contentType = "application/json";
        response.status = 400;
        response.response = {
            code: 400,
            msg: msg || "Bad Request",
        };
    }

    $401(response: ResponseContext) {
        response.contentType = "application/json";
        response.status = 401;
        response.response = {
            code: 401,
            msg: "Unauthorized",
        };
    }

    $404(response: ResponseContext, msg?: string) {
        response.contentType = "application/json";
        response.status = 404;
        response.response = {
            code: 404,
            msg: msg || "Not Found",
        };
    }

    $500(response: ResponseContext) {
        response.contentType = "application/json";
        response.status = 500;
        response.response = {
            code: 500,
            msg: "An error occurred",
        };
    }
}

export class NotFound extends Error {
    constructor(message: string = "Not Found") {
        super(message);
        this.name = "NotFound";
    }
}

export class BadRequest extends Error {
    constructor(message: string = "Bad Request") {
        super(message);
        this.name = "BadRequest";
    }
}

export class Unauthorized extends Error {
    constructor(message: string = "Unauthorized") {
        super(message);
        this.name = "Unauthorized";
    }
}

const restUtils = new RestUtils();
export default restUtils;
