import { BuildData, DownloadData } from "./dataTypes.ts";
import { BadRequest } from "./restUtils.ts";
import { getProjectRepository } from "./projectUtils.ts";
import { getVersionName } from "./versionUtils.ts";

const downloadSources = {
    application: "application",
};

export async function getDownloadData(downloadSource: string, buildData: BuildData): Promise<DownloadData> {
    switch (downloadSource) {
        case downloadSources.application:
            return await getApplicationDownloadData(buildData);
        default:
            throw new BadRequest("Unsupported download source: " + downloadSource);
    }
}

async function getApplicationDownloadData(buildData: BuildData): Promise<DownloadData> {
    const projectId = buildData.projectId;
    const repo = await getProjectRepository(projectId);
    const versionName = await getVersionName(projectId, buildData.versionId);
    return {
        name: downloadSources.application,
        jarName: buildData.jarName,
        sha256: buildData.sha256,
        url: `${repo}/releases/download/${versionName}-${buildData.tag}/${projectId}-${versionName}.jar`,
    };
}