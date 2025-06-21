import VCLightRouter from "@vclight/router";
import RequestContext from "@vclight/router/dist/types/requestContext";
import ResponseContext from "@vclight/router/dist/types/responseContext";
import restUtils, { BadRequest, NotFound, Unauthorized } from "./utils/restUtils";

class MyRouter extends VCLightRouter {
    constructor() {
        super();
    }

    on(event: string, fn: (data: RequestContext, response: ResponseContext) => Promise<void>) {
        super.on(event, this.buildFn(fn));
    }

    pattern(pattern: RegExp, fn: (data: RequestContext, response: ResponseContext) => Promise<void>) {
        super.pattern(pattern, this.buildFn(fn));
    }

    get(event: string): (data: RequestContext, response: ResponseContext) => Promise<void> {
        return super.get(event);
    }

    private buildFn(fn: (data: RequestContext, response: ResponseContext) => Promise<void>) {
        return async function(request: RequestContext, response: ResponseContext) {
            try {
                await fn(request, response);
            } catch (e) {
                if (e instanceof NotFound) {
                    return restUtils.$404(response, e.message);
                } else if (e instanceof BadRequest) {
                    return restUtils.$400(response, e.message);
                } else if (e instanceof Unauthorized) {
                    return restUtils.$401(response);
                } else {
                    console.error(e);
                    return restUtils.$500(response);
                }
            }
        };
    }
}

const router = new MyRouter();
export default router;
