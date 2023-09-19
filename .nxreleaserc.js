module.exports = {
  changelog: true,
  npm: false,
  github: true,
  repositoryUrl: "https://github.com/yzhylin/react-module-federation.git",
  commitMessage: "chore(release): 🚀 release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
  tagFormat: "${PROJECT_NAME}/v${VERSION}",
  "branches": [
    "main"
  ],
  "plugins": [
    "semantic-release-unsquash"
  ]  // buildTarget: "${PROJECT_NAME}:build",
  // outputPath: '${WORKSPACE_DIR}/dist/packages/${PROJECT_NAME}'
}
