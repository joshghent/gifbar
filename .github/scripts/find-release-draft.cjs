const { readFileSync } = require('node:fs');

module.exports = async function findDraft({ github, context, core, version }) {
  version ??= JSON.parse(readFileSync('.release-please-manifest.json', 'utf8'))['.'];
  const tag = `v${version}`;
  // GET /releases/tags/:tag cannot reliably find an unpublished draft.
  const releases = await github.paginate(github.rest.repos.listReleases, {
    ...context.repo,
    per_page: 100,
  });
  const draft = releases.find(release => release.draft && release.tag_name === tag);
  if (!draft) return;

  // release-please stores the merge SHA here. Never rebuild a moving branch
  // into an older version when resuming after subsequent commits have landed.
  if (!/^[a-f0-9]{40}$/i.test(draft.target_commitish)) {
    throw new Error(`Draft ${tag} must target an exact commit SHA before it can be resumed`);
  }
  core.setOutput('id', String(draft.id));
  core.setOutput('tag_name', draft.tag_name);
  core.setOutput('sha', draft.target_commitish);
  core.info(`Resuming draft ${tag} at ${draft.target_commitish}`);
};
