import router from "../../../../router";
import { getBodyParam } from "../../../../utils/requestParser";
import { authentication } from "../../../../utils/authUtils";
import { ChangeData } from "../../../../utils/dataTypes";
import { getVersionGroupId, getVersionId, getVersionsLatestBuildId } from "../../../../utils/versionUtils";
import { getVersionGroupVersions } from "../../../../utils/versionGroupUtils";
import restUtils, { BadRequest } from "../../../../utils/restUtils";
import { insertChangesData } from "../../../../utils/changesUtils";
import { db } from "../../../../utils/db/db";
import { getProjectRepository } from "../../../../utils/projectUtils";
import env from "../../../../utils/env";

router.on("/v2/commit/build", async (request, response) => {
    const projectId = getBodyParam(request, "project_id");
    const versionName = getBodyParam(request, "version");
    const channel = getBodyParam(request, "channel");
    const rawChanges = getBodyParam(request, "changes");
    const jarName = getBodyParam(request, "jar_name");
    const sha256 = getBodyParam(request, "sha256");
    const rawTag = getBodyParam(request, "tag");

    authentication(request, "/v2/commit/build");

    const changesData = parseChanges(rawChanges);
    const changes = await insertChangesData(projectId, changesData);
    const versionId = await getVersionId(projectId, versionName);
    const versionGroupId = await getVersionGroupId(versionId);
    const versions = await getVersionGroupVersions(projectId, versionGroupId);
    const latestBuildId = await getVersionsLatestBuildId(projectId, versions.ids);
    const buildId = latestBuildId + 1;
    const time = new Date().toISOString();
    const experimental = channel === "experimental";
    const tag = rawTag.replace(`${versionName}-`, "");

    await db().query(
        `insert into builds (project, build_id, time, experimental, jar_name, sha256, version, tag, changes, download_sources)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [projectId, buildId, time, experimental, jarName, sha256, versionId, tag, changes, ["application"]],
    );

    triggerWebhook(projectId, versionName, tag).then();

    return restUtils.$200(response);
});

function parseChanges(changes: string): ChangeData[] {
    return changes
        .split(">>>")
        .filter(entry => entry)
        .map(entry => {
            const [commit, summary] = entry.split("<<<");
            if (!commit) throw new BadRequest("Commit hash is missing in one change entry");
            if (!summary) throw new BadRequest("Summary is missing in one change entry");
            return {
                commit,
                summary,
                message: (summary ?? "") + "\n",
            };
        });
}

async function triggerWebhook(projectId: string, version: string, tag: string) {
    const commitBuildWebhookUrl = env.webhook.commitBuildUrl;
    if (!commitBuildWebhookUrl) return;

    const projectRepo = await getProjectRepository(projectId);

    const webhookData = {
        project: projectId,
        repository: projectRepo,
        version,
        tag,
    };

    try {
        await fetch(commitBuildWebhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(webhookData),
        });
    } catch (error) {
        console.error(`Failed to trigger commit build webhook ${webhookData} :`, error);
    }
}