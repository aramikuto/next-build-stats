import core from "@actions/core";
import github from "@actions/github";

async function run() {
	try {
		const token = core.getInput("github-token");
		const octokit = github.getOctokit(token);

		const context = github.context;
		const { owner, repo, number: pull_number } = context.issue;

		await octokit.rest.issues.createComment({
			owner,
			repo,
			issue_number: pull_number,
			body: `# Test mesasge!`,
		});
	} catch (error) {
		let errorMessage;
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
