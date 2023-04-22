import { build, context } from "esbuild";
import open from "open";

const options = {
  entryPoints: ["./src/index.ts", "./src/scripts/mainPage.ts", "./src/background.ts"],
  bundle: true,
  outdir: "dist",
  target: "es6",
  minify: true,
  format: "iife",
  legalComments: "eof",
  logLevel: "info",
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

process.argv[2] === "-b" ? build(options) : context(options).then(context => context.watch());
