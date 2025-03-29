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
    const buildTimeInMS = core.getInput("build-time-in-ms") || undefined;
    const buildLogFilePath = core.getInput("build-log-file");

    const octokit = github.getOctokit(token);

    const context = github.context;
    const { owner, repo, number: pull_number } = context.issue;

    const buildLogsContent = await readFile(buildLogFilePath, "utf-8");

    const { res, warnings } = await parseBuildOutput(buildLogsContent);

    if (warnings.length > 0) {
      core.warning(
        `There was a warning while parsing the build output: ${warnings.join(
          ", "
        )}`
      );
    }

    const actionResult = formatResult(res, {
      depndencyInstallTimeInMS: dependencyInstallTimeInMS
        ? Number(dependencyInstallTimeInMS)
        : undefined,
      buildTimeInMS: buildTimeInMS ? Number(buildTimeInMS) : undefined,
    });

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: actionResult,
    });
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
