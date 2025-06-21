import { Client } from "pg";
import { logger } from "../log";
import { migrateDB } from "./migration";
import env from "../env";
import * as fs from "node:fs";

const dbVersion = 1;

let _db: Client | undefined = undefined;

export async function initDb(): Promise<Client> {
    if (!_db) {
        // connect
        _db = new Client({
            connectionString: env.db.url,
        });
        const e = _db.end;
        _db.end = async function() {
            // noinspection ES6MissingAwait
            e.apply(_db);
            _db = undefined;
        };
        _db.on("error", async (_) => {
            logger.error("Database error, reconnecting...");
            await _db?.end();
            await initDb();
        });
        await _db.connect();

        // migrate
        let status = 0; // -1 as init
        let currentDBVer: number | undefined = undefined;
        try {
            const result = await _db.query("select version from general;");
            currentDBVer = result.rows[0].version;
        } catch (e) {
            status = -1;
        }
        if (currentDBVer == undefined || status == -1) {
            await _db.query(fs.readFileSync(`${process.cwd()}/sql/init.sql`).toString());
            logger.info("Database initialized");
        } else {
            await migrateDB(currentDBVer, dbVersion, _db);
        }
    }
    return _db;
}

export function db(): Client {
    return <Client>_db;
}