const ROUTE_TYPES = Object.freeze({
  "○": "Static",
  "●": "SSG",
  "◐": "Partial Prerender",
  ƒ: "Dynamic",
});

export type RouteSizes = {
  path: string;
  type: (typeof ROUTE_TYPES)[keyof typeof ROUTE_TYPES];
  sizeInBytes: number;
  firstLoadSizeInBytes: number;
}[];

export async function parseBuildOutput(input: string): Promise<{
  res: RouteSizes;
  inferredBuildTimeMs: number | undefined;
  warnings: string[];
}> {
  const lines = input.split("\n").map((line) => line.trimStart());

  // Locate the start of the "Route" section
  const routeStartIndex = lines.findIndex((line) =>
    line.startsWith("Route (app)")
  );
  if (routeStartIndex === -1) {
    throw new Error("Route section not found in the build log.");
  }

  // Extract lines after the "Route" header
  const routeLines = [];
  for (let i = routeStartIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined) {
      break;
    }
    if (line.startsWith("├") || line.startsWith("┌") || line.startsWith("└")) {
      routeLines.push(line);
    } else {
      break;
    }
  }

  let warnings: string[] = [];
  const res: RouteSizes = [];
  for (const line of routeLines) {
    const [routePart, sizePart, firstLoadPart] = line.split(/\s{2,}/);

    if (!routePart || !sizePart || !firstLoadPart) {
      warnings.push(`Invalid line format: ${line}`);
      continue;
    }

    try {
      const type =
        routePart[2] === "○"
          ? "Static"
          : routePart[2] === "●"
          ? "SSG"
          : routePart[2] === "ƒ"
          ? "Dynamic"
          : undefined;

      if (!type) {
        throw new Error(`Unknown route type: ${routePart}`);
      }
      const path = routePart.slice(3).trim();

      const sizeInBytes = parseSize(sizePart);
      const firstLoadSizeInBytes = parseSize(firstLoadPart);
      res.push({
        path,
        type,
        sizeInBytes,
        firstLoadSizeInBytes,
      });
    } catch (error) {
      if (error instanceof Error) {
        warnings.push(`Error parsing line "${line}": ${error.message}`);
      } else {
        warnings.push(`Error parsing line "${line}": ${String(error)}`);
      }
    }
  }
  let inferredBuildTimeMs: number | undefined;
  if (
    lines.at(-1)?.startsWith("sys ") &&
    lines.at(-2)?.startsWith("user ") &&
    lines.at(-3)?.startsWith("real ")
  ) {
    const realTimeLine = lines.at(-3)!;
    const buildTimeMatch = Number.parseFloat(realTimeLine.slice(4));
    inferredBuildTimeMs = buildTimeMatch * 1000;
  }

  return { res, inferredBuildTimeMs, warnings };
}

function parseSize(sizeString: string): number {
  if (sizeString.endsWith("kB")) {
    return parseFloat(sizeString) * 1024;
  } else if (sizeString.endsWith("B")) {
    return parseFloat(sizeString);
  } else if (sizeString.endsWith("MB")) {
    return parseFloat(sizeString) * 1024 * 1024;
  } else {
    throw new Error(`Unknown size format: ${sizeString}`);
  }
}
