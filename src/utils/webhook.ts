import { createHash } from "crypto";
import Env from "./env";

export default async function triggerWebhook(
    repo: string,
    project: string,
    version: string,
    tag: string
): Promise<Response> {
    try {
        const payload = {
            repo: repo,
            project: project,
            version: version,
            tag: tag
        };
        const authHeader = createHash("md5")
            .update(
                parseInt(String(Math.floor(Date.now() / 1000)).slice(0, -1), 10) +
                    Env.WEBHOOK_PASSWORD
            )
            .digest("hex");
        const response = await fetch(Env.WEBHOOK_ENTRYPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-LeavesMC-Authorization": authHeader
            },
            body: JSON.stringify(payload)
        });
        if (response.status !== 202) {
            if (response.status === 403) {
                await sleep(3000);
                triggerWebhook(repo, project, version, tag); // Retry
            }
            if (response.status === 500) {
                await sleep(5000);
                triggerWebhook(repo, project, version, tag); // Retry
            }
            return;
        }
    } catch (e) {
        console.error(e);
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
