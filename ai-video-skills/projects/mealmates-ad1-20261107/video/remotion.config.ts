/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Local fix: Remotion 4.0.53x+ ships Chrome 157 headless shell, which crashes on this Mac
// (icu_util "Check failed"). Use the working Chrome 149 copy (see ai-video-skills/motion-graphics/README.md).
Config.setBrowserExecutable(
  '/Users/mbgrao/Desktop/brag/ai-video-skills/_browsers/chrome-headless-shell-149/chrome-headless-shell',
);
