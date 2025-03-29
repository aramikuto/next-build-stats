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
});
