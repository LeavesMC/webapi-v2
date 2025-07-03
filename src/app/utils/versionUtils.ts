import { NotFound } from "./restUtils";
import { BuildData } from "./dataTypes";
import { toBuildData } from "./buildUtils";
import { EXTRA_VERSION_GROUP } from "../config/extraVersionGroup";
import { db } from "./db/db";

export function generateVersionGroupName(projectId: string, version: string): string {
    let [major, minor, patch] = version.split(".").map(str => parseInt(str));
    minor = minor || 0;
    patch = patch || 0;
    for (const versionGroup of EXTRA_VERSION_GROUP) {
        if (versionGroup.validate(projectId, [major, minor, patch])) {
            return versionGroup.getGroupName();
        }
    }
    return `${major}.${minor}`;
}

export async function getVersionGroupId(versionId: number): Promise<number> {
    const result = await db().query(
        "select version_group from versions where id = $1",
        [versionId],
    );
    const versionGroup = result.rows[0]?.version_group;
    if (!versionGroup) throw new NotFound("Version not found");
    return versionGroup;
}

export async function getVersionId(projectId: string, versionName: string): Promise<number> {
    const result = await db().query(
        "select id from versions where project = $1 and name = $2",
        [projectId, versionName],
    );
    const versionId = result.rows[0]?.id;
    if (!versionId) throw new NotFound("Version not found");
    return versionId;
}

export async function getVersionName(projectId: string, versionId: number): Promise<string> {
    const result = await db().query(
        "select name from versions where project = $1 and id = $2",
        [projectId, versionId],
    );
    const versionName = result.rows[0]?.name;
    if (!versionName) throw new NotFound("Version not found");
    return versionName;
}

export async function getVersionBuildsData(projectId: string, versionId: number): Promise<BuildData[]> {
    const result = await db().query(
        "select * from builds where project = $1 and version = $2",
        [projectId, versionId],
    );
    if (result.rows.length === 0) return [];
    return result.rows.map(row => toBuildData(row));
}

export async function getVersionsBuildsData(projectId: string, versionIds: number[]): Promise<BuildData[]> {
    const rawBuildsData = await Promise.all(
        versionIds.map(it => getVersionBuildsData(projectId, it)),
    );
    return rawBuildsData.flat();
}

export async function getVersionsLatestBuildId(projectId: string, versionIds: number[]): Promise<number> {
    const result = await db().query(
        "select max(build_id) as latest_build_id from builds where project = $1 and version = any($2)",
        [projectId, versionIds],
    );
    const latestBuildId = result.rows[0]?.latest_build_id;
    if (!latestBuildId) return 0;
    return latestBuildId;
}