import path from "path";
import fs from "fs";

const dir = path.join(process.cwd(), "assets", "content");

export default function deleteAsset(name: string): void {
    const list = ["default", "high", "medium", "low", "lowest", "square"];
    Promise.all(list
        .map(size => fs.promises.unlink(path.join(dir, `${name}_${size}.jpg`))));
}