const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// zustand's package.json "exports" map resolves "zustand/middleware" to its
// ESM build (esm/middleware.mjs) for web, which contains devtools code using
// `import.meta.env`. Metro bundles that as a non-module <script>, where
// `import.meta` is a syntax error and crashes the whole web bundle before it
// can hydrate. The CJS build (middleware.js) has the same exports but uses
// `process.env.NODE_ENV` instead, so force resolution to that file.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "zustand/middleware") {
    return {
      type: "sourceFile",
      filePath: path.resolve(__dirname, "node_modules/zustand/middleware.js"),
    };
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });