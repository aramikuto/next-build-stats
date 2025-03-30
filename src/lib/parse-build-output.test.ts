import { describe, it, expect } from "bun:test";
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
     sys 1.57`)
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
