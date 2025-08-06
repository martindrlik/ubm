# demo

Git clone and install:

```
git clone https://github.com/martindrlik/ubm.git
cd ubm
bun install
```

Create or edit `.env`:

```
AUTHORIZATION=...
BASE_URL=https://localhost:8443/api/ubm/v1/
DATABASE_URL=file:local.db
TENANT=foobar
```

Run:

```
export NODE_TLS_REJECT_UNAUTHORIZED=0
bun run dev --open
```
