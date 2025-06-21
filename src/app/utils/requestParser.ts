import RequestContext from "@vclight/router/dist/types/requestContext";
import { BadRequest } from "./restUtils";

/**
 * 解析请求 URL 的路径段，并校验其段数。
 * @param request 包含 url 属性的请求上下文对象
 * @param size 期望的路径段数（如 /v2/a/b/c 的 size 为 4）
 * @returns 路径分割后的字符串数组（如 ['v2', 'a', 'b', 'c']）
 * @throws BadRequest 当实际路径段数不等于 size 时抛出
 */
export function parseAndValidatePathSecs(request: RequestContext, size: number): string[] {
    const secs = request.url.split("/");
    secs.shift();
    if (secs.length < size) throw new BadRequest(`Invalid path format, expected at least ${size} segments, got ${secs.length}`);
    return secs;
}

export function getBodyParam(request: RequestContext, key: string): string {
    if (request.body === undefined) throw new BadRequest("Request body is missing");
    if (!(key in request.body)) throw new BadRequest(`Missing required body parameter: ${key}`);
    return request.body[key];
}