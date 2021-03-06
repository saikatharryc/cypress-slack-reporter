#!/usr/bin/env node

import * as program from "commander";
import * as fs from "fs";
import { logger } from "./logger";
import * as slacker from "./slack/slack-alert";
let version;
try {
  const json = JSON.parse(
    fs.readFileSync(
      "./node_modules/cypress-slack-reporter/package.json",
      "utf8"
    )
  );
  version = json.version;
} catch (e) {
  try {
    const json = JSON.parse(
      fs.readFileSync(
        "./node_modules/mochawesome-slack-reporter/package.json",
        "utf8"
      )
    );
    version = json.version;
  } catch (e) {
    version = "Cannot determine version";
  }
}

program
  .version(
    `git@github.com:YOU54F/cypress-slack-reporter.git@${version}`,
    "-v, --version"
  )
  .option(
    "--vcs-provider [type]",
    "VCS Provider [github|bitbucket|none]",
    "github"
  )
  .option("--ci-provider [type]", "CI Provider [circleci|none|custom]", "circleci")
  .option("--custom-url [type]", "On selected --ci-provider=custom this link will be set to Test Report",
   "circleci")
  .option(
    "--report-dir [type]",
    "mochawesome json & html test report directory, relative to your package.json",
    "mochareports"
  )
  .option(
    "--screenshot-dir [type]",
    "cypress screenshot directory, relative to your package.json",
    "cypress/screenshots"
  )
  .option(
    "--video-dir [type]",
    "cypress video directory, relative to your package.json",
    "cypress/videos"
  )
  .option("--verbose", "show log output")
  .option("--logger", "show log output")
  // .option("--s3", "upload artefacts to s3")
  .parse(process.argv);

const ciProvider: string = program.ciProvider;
const vcsProvider: string = program.vcsProvider;
const reportDirectory: string = program.reportDir;
const videoDirectory: string = program.videoDir;
const artifactURI: string = program.customUrl;
const screenshotDirectory: string = program.screenshotDir;
const verbose: boolean = program.verbose;

if (program.verbose || program.logger) {
  if (program.logger) {
    // tslint:disable-next-line: no-console
    console.log(
      "--logger option will soon be deprecated, please switch to --verbose"
    );
  }
  // tslint:disable-next-line: no-console
  console.log(
    " ciProvider:- " + ciProvider + "\n",
    "artifactURI:- " + artifactURI + "\n",
    "vcsProvider:- " + vcsProvider + "\n",
    "reportDirectory:- " + reportDirectory + "\n",
    "videoDirectory:- " + videoDirectory + "\n",
    "screenshotDirectory:- " + screenshotDirectory + "\n"
  );
}

slacker.slackRunner(
  ciProvider,
  vcsProvider,
  reportDirectory,
  videoDirectory,
  screenshotDirectory,
  artifactURI,
  verbose
);
