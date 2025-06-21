import { getChangesData } from "./changesUtils.ts";
import { BuildData } from "./dataTypes.ts";
import { NotFound } from "./restUtils.ts";
import { getDownloadData } from "./downloadUtils.ts";
import { db } from "./db/db.ts";

export function toBuildData(row: any): BuildData {
    return {
        projectId: row.project,
        buildId: row.build_id,
        timestamp: row.time,
        experimental: row.experimental,
        jarName: row.jar_name,
        sha256: row.sha256,
        versionId: row.version,
        tag: row.tag,
        changeIds: row.changes,
        downloadSources: row.download_sources,
    };
}

export async function toBuild(buildData: BuildData) {
    const changes = await getChangesData(buildData.changeIds);
    const downloads = await getBuildDownloads(buildData);
    return {
        build: buildData.buildId,
        time: buildData.timestamp,
        channel: buildData.experimental ? "experimental" : "default",
        promoted: false,
        changes: changes,
        downloads: downloads,
    };
}

export async function getBuildData(projectId: string, versionId: number, buildId: number): Promise<BuildData> {
    const result = await db().query(
        "select * from builds where project = $1 and version = $2 and build_id = $3",
        [projectId, versionId, buildId],
    );
    if (result.rows.length === 0) throw new NotFound(`Build ${buildId} not found in project ${projectId}`);
    return toBuildData(result.rows[0]);
}

export async function getBuildDownloads(buildData: BuildData) {
    const downloads: Record<string, object> = {};

    for (const it of buildData.downloadSources) {
        const downloadData = await getDownloadData(it, buildData);
        downloads[downloadData.name] = {
            name: downloadData.jarName,
            sha256: downloadData.sha256,
        };
    }

    return downloads;
}

export function parseBuildId(raw: string): number {
    const buildId = Number(raw);
    if (isNaN(buildId)) throw new NotFound(`Invalid build id ${raw}`);
    return buildId;
}

export async function getDownloadSources(projectId: string, tag: string): Promise<string[]> {
    const result = await db().query(
        "select id, download_sources from builds where project = $1 and tag = $2",
        [projectId, tag],
    );
    if (result.rows.length === 0) throw new NotFound(`Build ${projectId}-${tag} not found`);

    return result.rows[0].download_sources;
}