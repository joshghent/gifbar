const { test } = require('node:test');
const assert = require('node:assert/strict');
const findDraft = require('./find-release-draft.cjs');

const sha = 'e'.repeat(40);
const draft = { id: 123, draft: true, tag_name: 'v2.3.0', target_commitish: sha };

async function resolve(releases) {
  const outputs = {};
  await findDraft({
    version: '2.3.0',
    context: { repo: { owner: 'example', repo: 'gifbar' } },
    github: {
      rest: { repos: { listReleases: 'listReleases' } },
      paginate: async (endpoint, options) => {
        assert.equal(endpoint, 'listReleases');
        assert.deepEqual(options, { owner: 'example', repo: 'gifbar', per_page: 100 });
        return releases;
      },
    },
    core: { setOutput: (key, value) => { outputs[key] = value; }, info: () => {} },
  });
  return outputs;
}

test('resumes the current draft at its original commit, ignoring older drafts', async () => {
  assert.deepEqual(await resolve([{ ...draft, tag_name: 'v2.1.0' }, draft]), {
    id: '123', tag_name: 'v2.3.0', sha,
  });
});

test('does not rebuild a published immutable release', async () => {
  assert.deepEqual(await resolve([{ ...draft, draft: false }]), {});
});

test('allows release-please to proceed when no matching draft exists', async () => {
  assert.deepEqual(await resolve([]), {});
  assert.deepEqual(await resolve([{ ...draft, tag_name: 'v2.1.0' }]), {});
});

test('refuses a draft targeting a moving branch', async () => {
  await assert.rejects(resolve([{ ...draft, target_commitish: 'master' }]), /exact commit SHA/);
});
