import router from "../../../../router.ts";
import { getBodyParam } from "../../../../utils/requestParser.ts";
import { authentication } from "../../../../utils/authUtils.ts";
import { ChangeData } from "../../../../utils/dataTypes.ts";
import { getVersionGroupId, getVersionIdOrCreate, getVersionsLatestBuildId } from "../../../../utils/versionUtils.ts";
import { getVersionGroupVersions } from "../../../../utils/versionGroupUtils.ts";
import restUtils, { BadRequest } from "../../../../utils/restUtils.ts";
import { insertChangesData } from "../../../../utils/changesUtils.ts";
import { db } from "../../../../utils/db/db.ts";

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
    const versionId = await getVersionIdOrCreate(projectId, versionName);
    const versionGroupId = await getVersionGroupId(versionId); // getVersionIdOrCreate also creates the version group if it doesn't exist
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