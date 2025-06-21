import router from "../../../../../router.ts";
import { getBodyParam } from "../../../../../utils/requestParser.ts";
import { authentication } from "../../../../../utils/authUtils.ts";
import { getDownloadSources } from "../../../../../utils/buildUtils.ts";
import restUtils, { NotFound } from "../../../../../utils/restUtils.ts";
import { db } from "../../../../../utils/db/db.ts";

router.on("/v2/delete/build/download_source", async (request, response) => {
    const projectId = getBodyParam(request, "project");
    const tag = getBodyParam(request, "tag");
    const downloadSource = getBodyParam(request, "download_source");

    authentication(request, "/v2/commit/build/download_source");

    const downloadSources = await getDownloadSources(projectId, tag);

    if (downloadSources.includes(downloadSource)) {
        await removeDownload(projectId, tag, downloadSource);
        await removeBuildDownloadSource(projectId, tag, downloadSource);
    } else {
        throw new NotFound(`Specified download source ${downloadSource} not found for ${projectId}-${tag}`);
    }

    return restUtils.$200(response);
});

async function removeDownload(projectId: string, tag: string, downloadSource: string): Promise<void> {
    const result = await db().query(
        "delete from downloads where project = $1 and tag = $2 and download_source = $3",
        [projectId, tag, downloadSource],
    );
    if (result.rowCount === 0) throw new NotFound(`Download source ${downloadSource} for ${projectId}-${tag} not found`);
}

async function removeBuildDownloadSource(projectId: string, tag: string, downloadSource: string): Promise<void> {
    await db().query(
        "update builds set download_sources = array_remove(download_sources, $1) where project = $2 and tag = $3",
        [downloadSource, projectId, tag],
    );
}
