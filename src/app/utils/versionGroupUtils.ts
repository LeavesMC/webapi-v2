import { NotFound } from "./restUtils.ts";
import { db } from "./db/db.ts";

export async function getVersionGroupId(projectId: string, versionGroupName: string): Promise<number> {
    const result = await db().query(
        "select id from version_groups where project = $1 and name = $2",
        [projectId, versionGroupName],
    );
    const id = result.rows[0]?.id;
    if (!id) throw new NotFound(`Version group '${versionGroupName}' not found in project '${projectId}'`);
    return result.rows[0]?.id || undefined;
}

export async function getVersionGroupIdOrCreate(projectId: string, versionGroupName: string): Promise<number> {
    try {
        return await getVersionGroupId(projectId, versionGroupName);
    } catch (error) {
        if (error instanceof NotFound) {
            return await createVersionGroupId(projectId, versionGroupName);
        }
        throw error;
    }
}

async function createVersionGroupId(projectId: string, versionGroupName: string): Promise<number> {
    const result = await db().query(
        "insert into version_groups (project, name) values ($1, $2) returning id",
        [projectId, versionGroupName],
    );
    return result.rows[0].id;
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