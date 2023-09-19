module.exports = {
  changelog: true,
  npm: false,
  github: true,
  repositoryUrl: "https://github.com/yzhylin/react-module-federation.git",
  branches: [
    "main"
  ],
  tagFormat: "${PROJECT_NAME}/v${VERSION}",
  commitMessage: "chore(release): 🚀 release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
  plugins: [
    "semantic-release-unsquash"
  ]
}
