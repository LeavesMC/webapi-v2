import { NotFound } from "./restUtils";
import { db } from "./db/db";

export async function getVersionGroupId(projectId: string, versionGroupName: string): Promise<number> {
    const result = await db().query(
        "select id from version_groups where project = $1 and name = $2",
        [projectId, versionGroupName],
    );
    const id = result.rows[0]?.id;
    if (!id) throw new NotFound(`Version group '${versionGroupName}' not found in project '${projectId}'`);
    return result.rows[0]?.id || undefined;
}

export async function getVersionGroupVersions(projectId: string, versionGroupId: number): Promise<{ ids: number[], names: string[] }> {
    const result = await db().query(
        "select id, name from versions where project = $1 and version_group = $2",
        [projectId, versionGroupId],
    );
    const ids = result.rows.map((row) => row.id);
    const names = result.rows.map((row) => row.name);
    return {
        ids: ids,
        names: names,
    };
}