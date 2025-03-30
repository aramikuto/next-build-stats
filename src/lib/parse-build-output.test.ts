import { describe, expect, it } from "bun:test";
import { parseBuildOutput } from "./parse-build-output";

describe("parseBuildOutput", () => {
  it("parses the build output correctly", async () => {
    expect(
      parseBuildOutput(`
   ▲ Next.js 15.2.4

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                                 Size  First Load JS    
┌ ○ /                                    5.57 kB         106 kB
└ ○ /_not-found                            977 B         101 kB
+ First Load JS shared by all             100 kB
  ├ chunks/4bd1b696-5b6c0ccbd3c0c9ab.js  53.2 kB
  ├ chunks/684-c131fa2291503b5d.js       45.3 kB
  └ other shared chunks (total)          1.89 kB


○  (Static)  prerendered as static content
        `)
    ).resolves.toMatchInlineSnapshot(`
      {
        "inferredBuildTimeMs": undefined,
        "res": [
          {
            "firstLoadSizeInBytes": 108544,
            "path": "/",
            "sizeInBytes": 5703.68,
            "type": "Static",
          },
          {
            "firstLoadSizeInBytes": 103424,
            "path": "/_not-found",
            "sizeInBytes": 977,
            "type": "Static",
          },
        ],
        "warnings": [],
      }
    `);
  });

  it("can infer build time from the log", async () => {
    expect(
      parseBuildOutput(`

        ▲ Next.js 15.3.0-canary.24
        - Experiments (use with caution):
          ✓ ppr
     
        Creating an optimized production build ...
      ✓ Compiled successfully
      ✓ Linting and checking validity of types    
      ✓ Collecting page data    
      ✓ Generating static pages (6/6)
      ✓ Collecting build traces    
      ✓ Finalizing page optimization    
     
     Route (app)                                 Size  First Load JS    
     ┌ ○ /                                      145 B         110 kB
     ├ ○ /_not-found                            977 B         111 kB
     ├ ƒ /dynamic                               145 B         110 kB
     └ ƒ /ppr                                   145 B         110 kB
     + First Load JS shared by all             110 kB
       ├ chunks/451-e4cf411bd69b02ff.js       46.1 kB
       ├ chunks/f5e865f6-1f8c878860a9d318.js  62.4 kB
       └ other shared chunks (total)          1.86 kB
     
     
     ○  (Static)   prerendered as static content
     ƒ  (Dynamic)  server-rendered on demand
     
     
     real 9.46
     user 13.86
     sys 1.57
     `)
    ).resolves.toMatchInlineSnapshot(`
      {
        "inferredBuildTimeMs": 9460,
        "res": [
          {
            "firstLoadSizeInBytes": 112640,
            "path": "/",
            "sizeInBytes": 145,
            "type": "Static",
          },
          {
            "firstLoadSizeInBytes": 113664,
            "path": "/_not-found",
            "sizeInBytes": 977,
            "type": "Static",
          },
          {
            "firstLoadSizeInBytes": 112640,
            "path": "/dynamic",
            "sizeInBytes": 145,
            "type": "Dynamic",
          },
          {
            "firstLoadSizeInBytes": 112640,
            "path": "/ppr",
            "sizeInBytes": 145,
            "type": "Dynamic",
          },
        ],
        "warnings": [],
      }
    `);
  });
});

describe("Pages Router", () => {
  it("parses the build output correctly", async () => {
    expect(
      parseBuildOutput(`yarn run v1.22.22
$ next build
- info Linting and checking validity of types  
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
Browserslist: caniuse-lite is outdated. Please run:
  npx browserslist@latest --update-db
  Why you should do it regularly: https://github.com/browserslist/browserslist#browsers-data-updating
- info Creating an optimized production build  
- info Compiled successfully
- info Collecting page data  
- info Generating static pages (6/6)
- info Finalizing page optimization  

Route (pages)                              Size     First Load JS
┌ ○ /                                      265 B          77.6 kB
├   /_app                                  0 B            77.4 kB
├ ○ /404                                   271 B          77.6 kB
├ ○ /500                                   278 B          77.6 kB
├ ○ /about                                 261 B          77.6 kB
├ λ /api/hello                             0 B            77.4 kB
├ ○ /blog                                  258 B          77.6 kB
└ ○ /blog/post/[slug]                      319 B          77.7 kB
+ First Load JS shared by all              79 kB
  ├ chunks/framework-c3d692082d87967e.js   45.2 kB
  ├ chunks/main-370f533ac04afdbc.js        28.5 kB
  ├ chunks/pages/_app-ddc87574d961c5eb.js  2.86 kB
  ├ chunks/webpack-8fa1640cc84ba8fe.js     753 B
  └ css/ead5f2697f8080a6.css               1.67 kB

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)`)
    ).resolves.toMatchInlineSnapshot(`
      {
        "inferredBuildTimeMs": undefined,
        "res": [
          {
            "firstLoadSizeInBytes": 79462.4,
            "path": "/",
            "sizeInBytes": 265,
            "type": "Static",
          },
          {
            "firstLoadSizeInBytes": 79462.4,
            "path": "/404",
            "sizeInBytes": 271,
            "type": "Static",
          },
          {
            "firstLoadSizeInBytes": 79462.4,
            "path": "/500",
            "sizeInBytes": 278,
            "type": "Static",
          },
          {
            "firstLoadSizeInBytes": 79462.4,
            "path": "/about",
            "sizeInBytes": 261,
            "type": "Static",
          },
          {
            "firstLoadSizeInBytes": 79257.6,
            "path": "/api/hello",
            "sizeInBytes": 0,
            "type": "Server",
          },
          {
            "firstLoadSizeInBytes": 79462.4,
            "path": "/blog",
            "sizeInBytes": 258,
            "type": "Static",
          },
          {
            "firstLoadSizeInBytes": 79564.8,
            "path": "/blog/post/[slug]",
            "sizeInBytes": 319,
            "type": "Static",
          },
        ],
        "warnings": [
          "Error parsing line "├   /_app                                  0 B            77.4 kB": Unknown route type symbol: """,
        ],
      }
    `);
  });
});
