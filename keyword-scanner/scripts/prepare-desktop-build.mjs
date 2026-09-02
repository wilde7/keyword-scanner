import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist/desktop", { recursive: true, force: true });
await mkdir("dist/desktop", { recursive: true });
await cp("dist/client", "dist/desktop", { recursive: true });
console.log("Prepared Electron renderer: dist/desktop");
