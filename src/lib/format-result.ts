import type { RouteSizes } from "./parse-build-output";

export function formatResult(
  result: RouteSizes,
  metadata: {
    depndencyInstallTimeInMS?: number;
    buildTimeInMS?: number;
  } = {
    depndencyInstallTimeInMS: undefined,
    buildTimeInMS: undefined,
  }
) {
  const header = `# Build Stats\n\n`;
  const formatedRoutes = formatRoutes(result);
  const metadataInfo = formatMetadata(
    metadata.depndencyInstallTimeInMS,
    metadata.buildTimeInMS
  );

  return `${header}${formatedRoutes}${
    metadataInfo ? "\n\n" + metadataInfo : ""
  }`;
}

const byteFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  style: "unit",
  unit: "byte",
  unitDisplay: "narrow",
});

function formatRoutes(routes: RouteSizes): string {
  const header = `| Path | Type | Size | First Load Size |
|------|------|--------------|-------------------------|`;
  const rows = routes
    .map(
      (route) =>
        `| ${route.path} | ${route.type} | ${byteFormatter.format(
          route.sizeInBytes
        )} | ${byteFormatter.format(route.firstLoadSizeInBytes)} |`
    )
    .join("\n");

  return `## Route Sizes\n\n${header}\n${rows}`;
}

function formatMetadata(
  depndencyInstallTimeInMS: number | undefined,
  buildTimeInMS: number | undefined
) {
  const metadata = [];
  if (depndencyInstallTimeInMS !== undefined) {
    metadata.push(
      `**Dependency Install Time**: ${Math.floor(
        depndencyInstallTimeInMS / 1000
      )}s`
    );
  }
  if (buildTimeInMS !== undefined) {
    metadata.push(`**Build Time**: ${Math.floor(buildTimeInMS / 1000)}s`);
  }
  if (!metadata.length) {
    return undefined;
  }
  return `## Metadata
  
${metadata.join("\n")}`;
}
