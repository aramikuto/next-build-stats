import { before, describe, test } from "node:test";
import assert from "node:assert";

describe("Next.js output canary output test", () => {
	let parsedOutput = "";
	const expectedOutput = [
		{
			path: "/",
			type: "Static",
			sizeInBytes: 145,
			firstLoadSizeInBytes: 112640,
		},
		{
			path: "/_not-found",
			type: "Static",
			sizeInBytes: 977,
			firstLoadSizeInBytes: 113664,
		},
		{
			path: "/dynamic",
			type: "Dynamic",
			sizeInBytes: 145,
			firstLoadSizeInBytes: 112640,
		},
		{
			path: "/ppr",
			type: "Dynamic",
			sizeInBytes: 145,
			firstLoadSizeInBytes: 112640,
		},
	];
	before(() => {
		const output = process.env.ROUTE_STATS;
		if (!output) {
			throw new Error("ROUTE_STATS is not defined");
		}
		parsedOutput = JSON.parse(output);
		assert.strictEqual(parsedOutput.length, expectedOutput.length);
	});
	test(`output for each route is correct`, () => {
		for (let i = 0; i < parsedOutput.length; i++) {
			assert.strictEqual(
				parsedOutput[i].path,
				expectedOutput[i].path,
				`Path mismatch at index ${i}`,
			);
			assert.strictEqual(
				parsedOutput[i].type,
				expectedOutput[i].type,
				`Type mismatch for path ${parsedOutput[i].path}`,
			);
			assert.strictEqual(
				parsedOutput[i].sizeInBytes > 0,
				true,
				`Size mismatch for path ${parsedOutput[i].path}`,
			);
			assert.strictEqual(parsedOutput[i].firstLoadSizeInBytes > 0, true),
				`First load size mismatch for path ${parsedOutput[i].path}`;
		}
	});
});
