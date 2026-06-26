#!/usr/bin/env node
/**
 * One-time migration: assign `owner` to legacy records that predate the
 * owner-scoping change.
 *
 * Collections handled: Client, Project, Task, ClientActivity.
 * Only documents that are MISSING an owner (owner unset or null) are touched —
 * records that already have an owner are never modified.
 *
 * This script is intentionally standalone. It is NOT imported or run on server
 * startup. Run it manually, once, after deploying the owner-scoping changes.
 *
 * Usage:
 *   node scripts/backfill-owner.js --email=owner@example.com [--dry-run]
 *   node scripts/backfill-owner.js --id=507f1f77bcf86cd799439011 [--dry-run]
 *
 * Flags:
 *   --email=<email>   Resolve the target owner by user email.
 *   --id=<objectId>   Use the target owner's Mongo _id directly.
 *   --uri=<mongoUri>  Override MONGODB_URI for this run (optional).
 *   --dry-run         Report what WOULD change without writing anything.
 *
 * Exit codes: 0 = success, 1 = error / bad arguments.
 */

const path = require('path');
const mongoose = require('mongoose');

// Load server/.env regardless of the directory the script is invoked from.
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const User = require('../src/models/User');
const Client = require('../src/models/Client');
const Project = require('../src/models/Project');
const Task = require('../src/models/Task');
const ClientActivity = require('../src/models/ClientActivity');

const TARGET_MODELS = [
  { label: 'clients', model: Client },
  { label: 'projects', model: Project },
  { label: 'tasks', model: Task },
  { label: 'clientActivities', model: ClientActivity }
];

// Matches documents with no owner assigned.
const MISSING_OWNER_FILTER = { $or: [{ owner: { $exists: false } }, { owner: null }] };

const parseArgs = (argv) => {
  const args = { dryRun: false };

  argv.forEach((arg) => {
    if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg.startsWith('--email=')) {
      args.email = arg.slice('--email='.length).trim();
    } else if (arg.startsWith('--id=')) {
      args.id = arg.slice('--id='.length).trim();
    } else if (arg.startsWith('--uri=')) {
      args.uri = arg.slice('--uri='.length).trim();
    }
  });

  return args;
};

const resolveOwnerId = async ({ email, id }) => {
  if (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Provided --id is not a valid Mongo ObjectId: ${id}`);
    }

    const user = await User.findById(id).select('_id email').lean();

    if (!user) {
      throw new Error(`No user found with id: ${id}`);
    }

    return user;
  }

  if (email) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('_id email').lean();

    if (!user) {
      throw new Error(`No user found with email: ${email}`);
    }

    return user;
  }

  throw new Error('You must provide exactly one of --email=<email> or --id=<objectId>.');
};

const run = async () => {
  const args = parseArgs(process.argv.slice(2));

  if (args.email && args.id) {
    throw new Error('Provide only one of --email or --id, not both.');
  }

  const mongoUri = args.uri || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Pass --uri=<mongoUri> or set it in server/.env.');
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log(`Connected to MongoDB${args.dryRun ? ' (dry run — no writes)' : ''}.`);

  const owner = await resolveOwnerId(args);
  console.log(`Target owner: ${owner.email} (${owner._id})`);

  let totalAffected = 0;

  for (const { label, model } of TARGET_MODELS) {
    const count = await model.countDocuments(MISSING_OWNER_FILTER);
    totalAffected += count;

    if (count === 0) {
      console.log(`  ${label}: 0 legacy records without owner — nothing to do.`);
      continue;
    }

    if (args.dryRun) {
      console.log(`  ${label}: ${count} record(s) WOULD be assigned to ${owner._id}.`);
      continue;
    }

    const result = await model.updateMany(MISSING_OWNER_FILTER, { $set: { owner: owner._id } });
    console.log(`  ${label}: assigned owner to ${result.modifiedCount} record(s).`);
  }

  console.log(
    args.dryRun
      ? `Dry run complete. ${totalAffected} record(s) would be updated. Re-run without --dry-run to apply.`
      : `Migration complete. ${totalAffected} legacy record(s) processed.`
  );
};

run()
  .catch((error) => {
    console.error(`Migration failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
