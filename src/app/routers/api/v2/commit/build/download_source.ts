import router from "../../../../../router.ts";
import { getBodyParam } from "../../../../../utils/requestParser.ts";
import { authentication } from "../../../../../utils/authUtils.ts";
import { db } from "../../../../../utils/db/db.ts";
import restUtils from "../../../../../utils/restUtils.ts";
import { getDownloadSources } from "../../../../../utils/buildUtils.ts";

router.on("/v2/commit/build/download_source", async (request, response) => {
    const projectId = getBodyParam(request, "project");
    const tag = getBodyParam(request, "tag");
    const downloadSource = getBodyParam(request, "download_source");
    const url = getBodyParam(request, "url");

    authentication(request, "/v2/commit/build/download_source");

    const downloadSources = await getDownloadSources(projectId, tag);

    if (downloadSources.includes(downloadSource)) {
        await updateDownload(projectId, tag, downloadSource, url);
    } else {
        await insertDownload(projectId, tag, downloadSource, url);
        await addBuildDownloadSource(projectId, tag, downloadSource);
    }

    return restUtils.$200(response);
});

async function updateDownload(projectId: string, tag: string, downloadSource: string, url: string): Promise<void> {
    await db().query(
        "update downloads set url = $1 where project = $2 and tag = $3 and download_source = $4",
        [url, projectId, tag, downloadSource],
    );
}

async function insertDownload(projectId: string, tag: string, downloadSource: string, url: string): Promise<void> {
    await db().query(
        `insert into downloads (project, tag, download_source, url)
         values ($1, $2, $2, $3)`,
        [projectId, tag, downloadSource, url],
    );
}

async function addBuildDownloadSource(projectId: string, tag: string, downloadSource: string): Promise<void> {
    await db().query(
        "update builds set download_sources = array_append(download_sources, $1) where project = $2 and tag = $3",
        [downloadSource, projectId, tag],
    );
}