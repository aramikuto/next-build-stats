import core from "@actions/core";
import github from "@actions/github";
import { readFile } from "node:fs/promises";
import { parseBuildOutput } from "./lib/parse-build-output";
import { formatResult } from "./lib/format-result";

async function run() {
  try {
    const token = core.getInput("github-token");
    const dependencyInstallTimeInMS =
      core.getInput("dependency-install-time-in-ms") || undefined;
    let buildTimeInMS = core.getInput("build-time-in-ms") || undefined;
    const buildLogFilePath = core.getInput("build-log-file");
    const isDryRun = core.getInput("dry-run") === "true";

    const octokit = github.getOctokit(token);

    const context = github.context;
    const { owner, repo, number: pull_number } = context.issue;

    const buildLogsContent = await readFile(buildLogFilePath, "utf-8");

    const {
      res: routeStats,
      inferredBuildTimeMs,
      warnings,
    } = await parseBuildOutput(buildLogsContent);

    if (inferredBuildTimeMs) {
      if (buildTimeInMS !== undefined) {
        core.warning(
          `Build log contains build time, but build-time-in-ms is also set. Ignoring the build time from the log.`
        );
      } else {
        buildTimeInMS = inferredBuildTimeMs.toString();
      }
    }

    if (warnings.length > 0) {
      core.warning(
        `There was a warning while parsing the build output:
        ${warnings.join(", ")}
        
        Please report this issue here https://github.com/aramikuto/next-build-stats/issues`
      );
    }

    const actionResult = formatResult(routeStats, {
      depndencyInstallTimeInMS: dependencyInstallTimeInMS
        ? Number(dependencyInstallTimeInMS)
        : undefined,
      buildTimeInMS: buildTimeInMS ? Number(buildTimeInMS) : undefined,
    });

    core.setOutput("route-stats", JSON.stringify(routeStats));

    if (!isDryRun) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: actionResult,
      });
    }
  } catch (error) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = JSON.stringify(error);
    }

    core.setFailed(errorMessage);
  }
}

run();
