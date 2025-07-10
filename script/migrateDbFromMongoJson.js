const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// ====== 只需修改以下常量即可适配不同项目 ======
const DB_CONFIG = {
    user: "postgres",
    password: "123456",
    host: "localhost",
    port: 5432,
    database: "postgres"
};
const PROJECT_ID = "leaves";
const PROJECT_NAME = "Leaves";
const PROJECT_REPO = "https://github.com/LeavesMC/leaves";
const JSON_DIR = ".";
const JSON_PATTERN = /^(.+)\.json$/;
// ===========================================

/**
 * 迁移 Mongo JSON 到 Postgres
 */
async function migrateDbFromMongoJson() {
    const client = new Client(DB_CONFIG);
    console.log("连接数据库...");
    await client.connect();

    // 插入项目
    console.log("插入项目信息...");
    await client.query(
        "insert into projects (id, name, repo) values ($1, $2, $3) on conflict (id) do nothing returning id",
        [PROJECT_ID, PROJECT_NAME, PROJECT_REPO]
    );

    // 遍历所有 JSON 文件
    const files = fs.readdirSync(JSON_DIR)
        .filter(f => JSON_PATTERN.test(f))
        .sort((a, b) => {
            // 按点分数字顺序排序
            const parse = s => s.replace(/\.json$/, '').split('.').map(Number);
            const aa = parse(a), bb = parse(b);
            for (let i = 0; i < Math.max(aa.length, bb.length); ++i) {
                const na = aa[i] ?? 0, nb = bb[i] ?? 0;
                if (na !== nb) return na - nb;
            }
            return 0;
        });
    console.log(`发现 ${files.length} 个 JSON 文件:`, files);
    for (const file of files) {
        const versionGroupName = file.match(JSON_PATTERN)[1];
        console.log(`\n处理版本组: ${versionGroupName} (${file})`);

        // 插入版本组
        console.log(`  插入版本组...`);
        const vgRes = await client.query(
            "insert into version_groups (project, name) values ($1, $2) on conflict do nothing returning id",
            [PROJECT_ID, versionGroupName]
        );
        const vgId = vgRes.rows[0]?.id ||
            (await client.query("select id from version_groups where project=$1 and name=$2", [PROJECT_ID, versionGroupName])).rows[0].id;

        // 读取 JSON
        console.log(`  读取 JSON 文件...`);
        const builds = JSON.parse(fs.readFileSync(path.join(JSON_DIR, file), "utf8"));

        // 按 version 分组
        console.log(`  按 version 分组...`);
        const versionMap = {};
        for (const build of builds) {
            if (!versionMap[build.version]) versionMap[build.version] = [];
            versionMap[build.version].push(build);
        }

        // 插入每个 version
        console.log(`  插入版本信息...`);
        const versionNameToId = {};
        for (const versionName of Object.keys(versionMap)) {
            const vRes = await client.query(
                "insert into versions (name, project, version_group) values ($1, $2, $3) on conflict do nothing returning id",
                [versionName, PROJECT_ID, vgId]
            );
            versionNameToId[versionName] = vRes.rows[0]?.id ||
                (await client.query("select id from versions where name=$1 and project=$2 and version_group=$3", [versionName, PROJECT_ID, vgId])).rows[0].id;
        }

        // 插入 changes，建立 commit->id 映射
        console.log(`  插入变更记录...`);
        const commitToId = {};
        for (const build of builds) {
            for (const change of build.changes) {
                if (!commitToId[change.commit]) {
                    const res = await client.query(
                        "insert into changes (project, commit, summary, message) values ($1, $2, $3, $4) on conflict do nothing returning id",
                        [PROJECT_ID, change.commit, change.summary, change.message]
                    );
                    commitToId[change.commit] = res.rows[0]?.id ||
                        (await client.query("select id from changes where project=$1 and commit=$2", [PROJECT_ID, change.commit])).rows[0].id;
                }
            }
        }

        // 插入 builds
        console.log(`  插入构建记录...`);
        for (const build of builds) {
            const changeIds = build.changes.map(c => commitToId[c.commit]);
            const experimental = build.channel === "experimental";
            await client.query(
                `insert into builds
                 (project, build_id, time, experimental, jar_name, sha256, version, tag, changes, download_sources)
                 values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 on conflict do nothing`,
                [
                    PROJECT_ID,
                    build.build_id,
                    build.time,
                    experimental,
                    build.jar_name,
                    build.sha256,
                    versionNameToId[build.version],
                    build.tag,
                    changeIds,
                    ["github"]
                ]
            );
        }
        console.log(`  版本组 ${versionGroupName} 迁移完成`);
    }

    await client.end();
    console.log(`[${PROJECT_ID}] 所有版本组迁移完成`);
}

migrateDbFromMongoJson().catch(e => {
    console.error(e);
    process.exit(1);
});
