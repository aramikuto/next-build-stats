import { describe, it, expect } from "bun:test";
import { formatResult } from "./format-result";
import type { RouteSizes } from "./parse-build-output";

describe("formatResult", () => {
  it("formats the result correctly", async () => {
    const routeSizes: RouteSizes = [
      {
        path: "/",
        type: "Static",
        sizeInBytes: 5703.68,
        firstLoadSizeInBytes: 108544,
      },
      {
        path: "/ssg",
        type: "SSG",
        sizeInBytes: 1234,
        firstLoadSizeInBytes: 5678,
      },
      {
        path: "/ppr",
        type: "Partial Prerender",
        sizeInBytes: 4321,
        firstLoadSizeInBytes: 8765,
      },
      {
        path: "/dynamic",
        type: "Dynamic",
        sizeInBytes: 5678,
        firstLoadSizeInBytes: 1234,
      },
    ];

    expect(formatResult(routeSizes)).toMatchInlineSnapshot(`
      "# Build Stats

      ## Route Sizes

      | Path | Type | Size | First Load Size |
      |------|------|--------------|-------------------------|
      | / | Static | 5.7KB | 109KB |
      | /ssg | SSG | 1.2KB | 5.7KB |
      | /ppr | Partial Prerender | 4.3KB | 8.8KB |
      | /dynamic | Dynamic | 5.7KB | 1.2KB |"
    `);
  });

  it("formats the result with metadata correctly", async () => {
    const routeSizes: RouteSizes = [
      {
        path: "/",
        type: "Static",
        sizeInBytes: 5703.68,
        firstLoadSizeInBytes: 108544,
      },
    ];

    expect(
      formatResult(routeSizes, {
        depndencyInstallTimeInMS: 0,
        buildTimeInMS: 5678,
      })
    ).toMatchInlineSnapshot(`
      "# Build Stats

      ## Route Sizes

      | Path | Type | Size | First Load Size |
      |------|------|--------------|-------------------------|
      | / | Static | 5.7KB | 109KB |

      ## Metadata
        
      **Dependency Install Time**: 0s
      **Build Time**: 5s"
    `);

    expect(
      formatResult(routeSizes, {
        depndencyInstallTimeInMS: 1234,
      })
    ).toMatchInlineSnapshot(`
      "# Build Stats

      ## Route Sizes

      | Path | Type | Size | First Load Size |
      |------|------|--------------|-------------------------|
      | / | Static | 5.7KB | 109KB |

      ## Metadata
        
      **Dependency Install Time**: 1s"
    `);

    expect(
      formatResult(routeSizes, {
        buildTimeInMS: 5678,
      })
    ).toMatchInlineSnapshot(`
      "# Build Stats

      ## Route Sizes

      | Path | Type | Size | First Load Size |
      |------|------|--------------|-------------------------|
      | / | Static | 5.7KB | 109KB |

      ## Metadata
        
      **Build Time**: 5s"
    `);
  });
});
