# Next Build Stats

Track and analyze Next.js page sizes, per-page rendering type and build performance with automated PR comments.

## 🚀 Key Features

- Automatically generates per-route build statistics
- Creates informative PR comments with performance metrics
- Helps track build time and dependency installation time
- Supports both App Router and Pages Router
- Compatible with latest Next.js versions

## 📋 Quick Start Guide

This GitHub Action runs on workflows triggered by **pull_request** events.

> [!IMPORTANT]
> Ensure your workflow has `pull-requests: write` permission to create comments.

### Installation Steps

1. **Capture Build Logs**
  Save your Next.js build logs to a file by modifying your build command:
  ```bash
  npm run build | tee build.log
  ```

  You can also measure the build time, which will automatically be included in the output:
  ```bash
  command time -p npm run build 2>&1 | tee build.log
  ```

  **Important:** Error redirection (`2>&1`) should be used to capture the measured time.

2. **Add to Workflow**
   Include this action after your build step:
   ```yaml
   - uses: aramikuto/next-build-stats@main
     with:
       build-log-file: 'build.log'
   ```

Once configured, you'll see detailed build statistics in your PR comments:

![Build Statistics Example](/assets/output_screenshot.png?raw=true)

## ⚙️ Configuration Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| build-log-file | Build log file location | Yes | - |
| github-token | Token for PR comments | No | {{ github.token }} |
| dependency-install-time-in-ms | Dependency installation duration | No | - |
| build-time-in-ms | Custom build duration override | No | - |
| dry-run | Test mode without comments | No | false |

## 📊 Output Values

| Name | Description |
|------|-------------|
| route-stats | JSON-formatted route statistics |

## 🔄 Version Compatibility

This action is compatible with build outputs from Next.js 13 and later versions. It is also compatible when using a build tool like NX or turborepo.

Weekly automated testing against Next.js canary releases ensures reliability:

[![Test Next.js Canary Compatibility](https://github.com/aramikuto/next-build-stats/actions/workflows/check-canary-next-compatibility.yml/badge.svg)](https://github.com/aramikuto/next-build-stats/actions/workflows/check-canary-next-compatibility.yml)

Found an issue? Please [submit a bug report](https://github.com/aramikuto/next-build-stats/issues). Check workflow warnings for troubleshooting insights.

## 🛠️ Development Setup

1. Clone the repository.
2. Install [bun](https://bun.sh).
3. Run `bun i` to install dependencies.
4. Set up git hooks: `git config --local core.hooksPath .githooks/`

The action source is in the [./dist](./dist) directory. Use `bun run build` to rebuild.

To run tests, use the following command: `bun run test`
