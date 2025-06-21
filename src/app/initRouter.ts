import * as fs from "fs";
import * as path from "path";

function importRouters(dir: string) {
    const files = fs.readdirSync(dir);
    files.forEach((file: string) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            importRouters(fullPath);
        } else if (file.endsWith(".ts") || file.endsWith(".js")) {
            require(fullPath);
        }
    });
}

importRouters(path.join(__dirname, "routers"));