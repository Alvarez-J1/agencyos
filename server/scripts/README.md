# Server migration scripts

These scripts are **manual, one-time** operations. They are never imported by
the application and never run on server startup.

## backfill-owner.js

Assigns an `owner` to legacy `Client`, `Project`, `Task`, and `ClientActivity`
documents created before owner-scoping was introduced. Only documents that have
**no owner** (field unset or `null`) are modified; records that already have an
owner are left untouched, so the script is safe to run more than once.

### Before you run

1. **Back up the database first** (e.g. `mongodump`). This script writes to
   production data.
2. Decide which user should own the legacy records. All ownerless records across
   the four collections are assigned to that single user.
3. Make sure `MONGODB_URI` points at the database you intend to migrate (it is
   read from `server/.env`, or pass `--uri=`).

### Dry run (recommended first)

Reports how many records *would* change, without writing anything:

```bash
cd server
node scripts/backfill-owner.js --email=owner@example.com --dry-run
```

### Apply the migration

By user email:

```bash
cd server
node scripts/backfill-owner.js --email=owner@example.com
```

Or by user id:

```bash
cd server
node scripts/backfill-owner.js --id=507f1f77bcf86cd799439011
```

### Flags

| Flag              | Description                                              |
| ----------------- | ------------------------------------------------------- |
| `--email=<email>` | Resolve the target owner by user email.                 |
| `--id=<objectId>` | Use the target owner's Mongo `_id` directly.            |
| `--uri=<mongoUri>`| Override `MONGODB_URI` for this run.                     |
| `--dry-run`       | Report changes without writing.                         |

Provide exactly one of `--email` or `--id`.

### Caveat: duplicate numeric ids

`Client`, `Project`, and `Task` enforce a unique compound index on
`{ owner, id }`. If legacy records assigned to the same target owner contain
duplicate numeric `id` values (possible if `id` used to be globally sequential),
the unique index build can fail after backfill. Run the dry run first, and if
duplicates exist, deduplicate or reassign `id`s before applying.
