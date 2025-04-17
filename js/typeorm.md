# typeorm

typeorm cli can read the config from `ormconfig.json` file in current directory.
```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "****",
  "database": "school"
}
```

## creating new migration file
to create a migration file (v0.2.x): `npx typeorm migration:create -d ./src/migration -n AddingNewColum`

to create a migration file (new version of typeorm - v0.3.x): `npx typeorm migration:create ./src/migration/AddingNewColum`

