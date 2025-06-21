import { NotFound } from "./restUtils";
import { db } from "./db/db";

export async function getProjectName(projectId: string): Promise<string> {
    const result = await db().query("select name from projects where id = $1", [projectId]);
    const name = result.rows[0]?.name;
    if (!name) throw new NotFound(`Project with ID ${projectId} not found`);
    return name;
}

export async function getProjectRepository(projectId: string): Promise<string> {
    const result = await db().query("select repo from projects where id = $1", [projectId]);
    const repository = result.rows[0]?.repo;
    if (!repository) throw new NotFound(`Project with ID ${projectId} not found`);
    return repository;
}

export async function getProjectVersions(projectId: string): Promise<string[]> {
    const result = await db().query("select name from versions where project = $1", [projectId]);
    return result.rows.map((row) => row.name);
}

export async function getProjectVersionGroups(projectId: string): Promise<string[]> {
    const result = await db().query("select name from version_groups where project = $1", [projectId]);
    return result.rows.map((row) => row.name);
}
