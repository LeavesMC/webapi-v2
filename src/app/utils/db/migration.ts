import { Client } from "pg";
import { readFileSync } from "node:fs";
import { logger } from "../log";

class Migration {
    from: number;
    to: number;
    sql: string;

    constructor(from: number, to: number, sql: string) {
        if (from >= to) throw new Error("from should be less than to");
        this.from = from;
        this.to = to;
        this.sql = sql;
    }

    /**
     *
     * @param from
     * @param to
     * @param file e.g. "1_2" will read from "/sql/1_2.sql"
     */
    static fromFile(from: number, to: number, file: string) {
        return new Migration(from, to, readFileSync(`${process.cwd()}/sql/${file}.sql`).toString());
    }
}

export async function migrateDB(from: number, to: number, db: Client) {
    while (from != to) {
        let flag = false;
        for (const migration of migrations) {
            if (migration.from === from) {
                logger.info(`Database migrated from ${from} to ${migration.to}`);
                await db.query(migration.sql);
                from = migration.to;
                flag = true;
                break;
            }
        }
        if (!flag) {
            throw new Error(`Database Migration from ${from} to ${to} not found`);
        }
    }
}

const migrations: Migration[] = [
    // Migration.fromFile(1, 2, "1_2")
];