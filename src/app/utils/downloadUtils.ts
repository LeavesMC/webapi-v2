import { BuildData, DownloadData } from "./dataTypes";
import { getProjectRepository } from "./projectUtils";
import { getVersionName } from "./versionUtils";
import { db } from "./db/db";

export async function getDownloadData(downloadSource: string, buildData: BuildData): Promise<DownloadData> {
    switch (downloadSource) {
        case "github":
        case "application":
            return await getApplicationDownloadData(buildData);
        default:
            return await getDbDownloadData(downloadSource, buildData);
    }
}

async function getDbDownloadData(downloadSource: string, buildData: BuildData): Promise<DownloadData> {
    const result = await db().query(
        "select url from downloads where project = $1 and tag = $2 and download_source = $3",
        [buildData.projectId, buildData.tag, downloadSource],
    );
    if (result.rows.length === 0) {
        return await getApplicationDownloadData(buildData); // temp fix
        // throw new NotFound(`Download data not found for project ${buildData.projectId}, tag ${buildData.tag}, source ${downloadSource}`);
    }
    return {
        name: downloadSource,
        jarName: buildData.jarName,
        sha256: buildData.sha256,
        url: result.rows[0].url,
    };
}

async function getApplicationDownloadData(buildData: BuildData): Promise<DownloadData> {
    const projectId = buildData.projectId;
    const repo = await getProjectRepository(projectId);
    const versionName = await getVersionName(projectId, buildData.versionId);
    return {
        name: "application",
        jarName: buildData.jarName,
        sha256: buildData.sha256,
        url: `${repo}/releases/download/${versionName}-${buildData.tag}/${projectId}-${versionName}.jar`,
    };
}