#!/usr/bin/env node

/**
 * Simple orchestrator that keeps contentlayer's watcher running alongside `next dev`.
 * This is required because `next-contentlayer` currently hooks into webpack, while
 * our dev server defaults to Turbopack. Without this script, `.contentlayer/generated`
 * never gets created and Next.js fails to resolve `contentlayer/generated`.
 */

import { spawn } from "node:child_process";
import process from "node:process";

const isWindows = process.platform === "win32";
const bin = (name) => (isWindows ? `${name}.cmd` : name);

const spawnOnce = (cmd, args = [], options = {}) =>
	new Promise((resolve, reject) => {
		const child = spawn(cmd, args, { stdio: "inherit", ...options });
		child.on("exit", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`${cmd} exited with code ${code}`));
			}
		});
		child.on("error", reject);
	});

const spawnPersistent = (label, cmd, args = [], options = {}) => {
	const child = spawn(cmd, args, { stdio: "inherit", ...options });
	child.on("exit", (code, signal) => {
		if (signal) {
			return;
		}
		if (code !== 0) {
			console.error(`[${label}] exited with code ${code ?? 0}`);
			process.exit(code ?? 1);
		}
	});
	child.on("error", (err) => {
		console.error(`[${label}] failed to start`, err);
		process.exit(1);
	});
	return child;
};

const main = async () => {
	try {
		console.log("▶ Running a one-off contentlayer build...");
		await spawnOnce(bin("contentlayer2"), ["build"], {
			env: process.env,
		});
	} catch (error) {
		console.error("✖ contentlayer build failed");
		console.error(error);
		process.exit(1);
	}

	const children = [];

	children.push(
		spawnPersistent("contentlayer", bin("contentlayer2"), ["dev"], {
			env: process.env,
		}),
	);

	children.push(
		spawnPersistent(
			"next",
			bin("next"),
			["dev"],
			{
				env: {
					...process.env,
					INIT_CWD: process.cwd(),
				},
			},
		),
	);

	const shutdown = (signal) => {
		children.forEach((child) => {
			if (!child.killed) {
				child.kill(signal);
			}
		});
		process.exit();
	};

	process.on("SIGINT", () => shutdown("SIGINT"));
	process.on("SIGTERM", () => shutdown("SIGTERM"));
};

main();

