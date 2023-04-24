import { build, context, type BuildOptions } from "esbuild";
import open from "open";
import fs from "fs/promises";
import fsSync from "fs";
import archiver from "archiver";

const prod = process.argv[2] === "-b";

const options: BuildOptions = {
  entryPoints: ["./src/index.ts", "./src/scripts/mainPage.ts", "./src/background.ts"],
  bundle: true,
  outdir: "dist",
  target: "es6",
  minify: true,
  format: "iife",
  legalComments: "eof",
  logLevel: "info",
  sourcemap: true,
  metafile: true,
  plugins: [
    {
      name: "CRX reloader",
      setup(build) {
        build.onEnd(() => {
          open("http://reload.extensions", { background: true });
        });
      },
    },
  ],
};

prod ? buildForProd() : watch();

function buildForProd() {
  build(options).then(result => {
    fs.writeFile("meta.json", JSON.stringify(result.metafile));
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });
    archive.pipe(fsSync.createWriteStream("./extension.zip"));
    archive.directory("dist/", false);
    archive.finalize();
  });
}

function watch() {
  context(options).then(context => context.watch());
}
