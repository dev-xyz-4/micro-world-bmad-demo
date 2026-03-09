#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);

const usage = [
  'Usage:',
  '  node scripts/quality/flow-contract-starter.mjs --feature-root <path> --feature-slug <slug> [--dry-run]',
  '',
  'Required:',
  '  --feature-root   Existing feature-root directory (resolved explicitly by caller)',
  '  --feature-slug   Lowercase kebab-case feature slug',
  '',
  'Optional:',
  '  --dry-run        Print planned actions without writing files',
  '  --help           Show this usage text',
].join('\n');

const printUsage = () => {
  console.log(usage);
};

const fail = (message, details = []) => {
  console.error('RESULT: failure');
  console.error(`ERROR: ${message}`);
  for (const detail of details) {
    console.error(detail);
  }
  process.exit(1);
};

const isHelp = args.includes('--help') || args.includes('-h');
if (isHelp) {
  printUsage();
  process.exit(0);
}

let featureRootArg = '';
let featureSlug = '';
let dryRun = false;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  switch (arg) {
    case '--feature-root': {
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        fail('Missing value for --feature-root.', [usage]);
      }
      featureRootArg = value;
      i += 1;
      break;
    }
    case '--feature-slug': {
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        fail('Missing value for --feature-slug.', [usage]);
      }
      featureSlug = value;
      i += 1;
      break;
    }
    case '--dry-run':
      dryRun = true;
      break;
    default:
      fail(`Unknown argument: ${arg}`, [usage]);
  }
}

if (!featureRootArg || !featureSlug) {
  fail('Missing required arguments.', [usage]);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(featureSlug)) {
  fail(
    'Invalid --feature-slug. Use lowercase kebab-case only (a-z, 0-9, and single hyphens).'
  );
}

const featureRoot = path.resolve(featureRootArg);
if (!fs.existsSync(featureRoot)) {
  fail(`Feature root does not exist: ${featureRoot}`);
}

let featureRootStat;
try {
  featureRootStat = fs.statSync(featureRoot);
} catch (error) {
  fail(`Unable to stat feature root: ${featureRoot}`, [String(error)]);
}

if (!featureRootStat.isDirectory()) {
  fail(`Feature root is not a directory: ${featureRoot}`);
}

const targetDir = path.resolve(featureRoot, featureSlug);
const relativeTarget = path.relative(featureRoot, targetDir);
if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) {
  fail('Unsafe target path resolution detected for the provided slug.');
}

const breakPath = path.join(targetDir, '01-break.md');
const questionsPath = path.join(targetDir, 'questions.md');
const existingTargets = [breakPath, questionsPath].filter((p) => fs.existsSync(p));

if (existingTargets.length > 0) {
  fail('Refusing to overwrite existing starter artifacts.', [
    'Existing paths:',
    ...existingTargets.map((p) => `- ${p}`),
  ]);
}

const breakContent = `# Break — ${featureSlug}

## 1) Problem Statement (one paragraph)
- 

## 2) Goal
- 

## 3) Non-Goals
- 

## 4) Users / Actors (if any)
- 

## 5) Inputs / Outputs
### Inputs
- 
### Outputs
- 

## 6) Constraints
- Technical:
- Performance:
- UX:
- Compatibility:
- Legal/Compliance (if relevant):

## 7) Unknowns / Open Questions
- 

## 8) Success Criteria (high level)
- 

## 9) Classification And Versioning Note
- Workflow classification: \`BMAD Feature\`.
- Version classification note: \`TBD\`.
`;

const questionsContent = `# Questions — ${featureSlug}

## Resolved
- none

## Baseline
- none

## Open / Blocking
- none
`;

const printSummary = (result) => {
  console.log(`RESULT: ${result}`);
  console.log(`MODE: ${dryRun ? 'dry-run' : 'write'}`);
  console.log(`FEATURE_ROOT: ${featureRoot}`);
  console.log(`FEATURE_SLUG: ${featureSlug}`);
  console.log(`TARGET_DIR: ${targetDir}`);
  console.log('FILES:');
  console.log(`- ${breakPath}`);
  console.log(`- ${questionsPath}`);
};

if (dryRun) {
  printSummary('dry-run');
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

let wroteBreak = false;
let wroteQuestions = false;

try {
  fs.writeFileSync(breakPath, breakContent, { encoding: 'utf8', flag: 'wx' });
  wroteBreak = true;
  fs.writeFileSync(questionsPath, questionsContent, { encoding: 'utf8', flag: 'wx' });
  wroteQuestions = true;
} catch (error) {
  if (wroteBreak && !wroteQuestions && fs.existsSync(breakPath)) {
    try {
      fs.unlinkSync(breakPath);
    } catch {
      // Best-effort cleanup only.
    }
  }
  fail('Failed while writing starter artifacts.', [String(error)]);
}

printSummary('success');
