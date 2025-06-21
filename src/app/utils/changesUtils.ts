import { ChangeData } from "./dataTypes";
import { db } from "./db/db";

export async function getChangeData(changeId: number): Promise<ChangeData> {
    const result = await db().query(
        "select commit, summary, message from changes where id = $1",
        [changeId],
    );
    return result.rows[0];
}

export async function getChangesData(changeIds: number[]): Promise<ChangeData[]> {
    return await Promise.all(
        changeIds.map(id => getChangeData(id)),
    );
}

export async function insertChangeData(projectId: string, change: ChangeData): Promise<number> {
    const result = await db().query(
        "insert into changes (project ,commit, summary, message) values ($1, $2, $3, $4) returning id",
        [projectId, change.commit, change.summary, change.message],
    );
    return result.rows[0].id;
}

export async function insertChangesData(projectId: string, changes: ChangeData[]): Promise<number[]> {
    return await Promise.all(
        changes.map(change => insertChangeData(projectId, change)),
    );
}