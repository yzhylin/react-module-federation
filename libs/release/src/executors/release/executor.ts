import { writeFileSync } from 'fs'
import { ReleaseExecutorSchema } from './schema';
import { ExecutorContext, ProjectConfiguration } from '@nx/devkit';
import { calculateFileChanges } from 'nx/src/project-graph/file-utils';
import { filterAffected } from 'nx/src/project-graph/affected/affected-project-graph';
import { exec } from 'child_process';
import { promisify } from 'util';
const execa = promisify(exec);

const file = 'CHANGELOG.md'

export default async function runExecutor(options: ReleaseExecutorSchema, context: ExecutorContext) {
  const { workspace, root, projectGraph} = context;

  const sha = await git.getLastCommit();
  const touchedFiles = await git.getTouchedFiles(sha);
  const message = await git.getCommitMessage(sha)
  const fileChanges = calculateFileChanges(touchedFiles, []);
  const affectedGraph = await filterAffected(projectGraph, fileChanges);

  for (const name in affectedGraph.nodes) {
    const config: ProjectConfiguration = workspace.projects[name]

    if (config.projectType !== 'application') {
      continue
    }

    const path = `${root}/${config.root}`;
    const releaseNotes = createReleaseNotes({ message });

    writeFileSync(`${path}/${file}`, releaseNotes, { flag: 'a'})
  }

  await execa(`git add . && git commit -m 'chore(release): 1.35.1 [skip ci]'`)
  await execa(`git push`)

  return {
    success: true,
  };
}

const createReleaseDate = () => {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: `0${now.getMonth()}`.slice(-2),
    date: `0${now.getDate()}`.slice(-2)
  }
}

function createReleaseNotes({ message }: { message: string }) {
  const { year, month, date} = createReleaseDate()

  return `
## [0.1.0](https://github.com/path/to/compare/v1.35.0...v1.35.1) (${year}-${month}-${date})

---

### Features

* ${message}


### Bug Fixes

* **[XYZ-0000]** commit message goes here
* **[XYZ-0000]** commit message goes here
* **[XYZ-0000]** commit message goes here



  `;
}

const git = {
  async getLastCommit():  Promise<string> {
    const { stdout: sha } = await execa('git rev-parse HEAD');

    return sha
  },

  async getTouchedFiles(sha: string): Promise<string[]> {
    const { stdout: filenames } = await execa(`git show --pretty="" --name-only ${sha}`);

    return filenames.split('\n').filter(Boolean);
  },

  async getCommitMessage(sha: string): Promise<string> {
    const { stdout: message } = await execa(`git show -s --format=%B ${sha}`);

    return message;
  }
}
