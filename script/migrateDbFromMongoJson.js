const fs = require("fs");
require("path");
const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    password: "123456",
    host: "localhost",
    port: 5432,
    database: "postgres"
});

async function main() {
    await client.connect();

    // 1. 插入项目（假设只有一个项目）
    const projectName = "Leaves";
    const projectRepo = "https://github.com/LeavesMC/leaves";
    const projectId = "leaves";
    {
        const res = await client.query(
                "INSERT INTO projects (id, name, repo) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING RETURNING id",
                [projectId, projectName, projectRepo]
        );
    }

    // 2. 遍历所有 leaves.*.json 文件
    const files = fs.readdirSync(".").filter(f => /^leaves\..+\.json$/.test(f));
    for (const file of files) {
        const versionGroupName = file.match(/^leaves\.(.+)\.json$/)[1];

        // 插入版本组
        const vgRes = await client.query(
                "INSERT INTO version_groups (project, name) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id",
                [projectId, versionGroupName]
        );
        // 兼容已存在
        const vgId = vgRes.rows[0]?.id ||
                (await client.query("SELECT id FROM version_groups WHERE project=$1 AND name=$2", [projectId, versionGroupName])).rows[0].id;

        // 读取 JSON
        const builds = JSON.parse(fs.readFileSync(file, "utf8"));

        // 按 version 分组
        const versionMap = {};
        for (const build of builds) {
            if (!versionMap[build.version]) versionMap[build.version] = [];
            versionMap[build.version].push(build);
        }

        // 插入每个 version
        const versionNameToId = {};
        for (const [versionName, versionBuilds] of Object.entries(versionMap)) {
            const vRes = await client.query(
                    "INSERT INTO versions (name, project, version_group) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id",
                    [versionName, projectId, vgId]
            );
            const vId = vRes.rows[0]?.id ||
                    (await client.query("SELECT id FROM versions WHERE name=$1 AND project=$2 AND version_group=$3", [versionName, projectId, vgId])).rows[0].id;
            versionNameToId[versionName] = vId;
        }

        // 插入 changes，建立 commit->id 映射
        const commitToId = {};
        for (const build of builds) {
            for (const change of build.changes) {
                if (!commitToId[change.commit]) {
                    const res = await client.query(
                            "INSERT INTO changes (project, commit, summary, message) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING id",
                            [projectId, change.commit, change.summary, change.message]
                    );
                    commitToId[change.commit] = res.rows[0]?.id ||
                            (await client.query("SELECT id FROM changes WHERE project=$1 AND commit=$2", [projectId, change.commit])).rows[0].id;
                }
            }
        }

        // 插入 builds
        for (const build of builds) {
            const changeIds = build.changes.map(c => commitToId[c.commit]);
            const experimental = build.channel === "experimental";
            await client.query(
                    `INSERT INTO builds
                     (project, build_id, time, experimental, jar_name, sha256, version, tag, changes, download_sources)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                     ON CONFLICT DO NOTHING`,
                    [
                        projectId,
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
    }

    await client.end();
    console.log("所有版本组迁移完成");
}

main().catch(e => {
    console.error(e);
    client.end();
});