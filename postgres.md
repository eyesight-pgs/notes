# postgres

- What is called *"database"* in MySQL is called a *"schema"* in standard SQL.<br>
[see stackoverflow](https://stackoverflow.com/a/51786826)

- default postgres password: `postgresql`

## create new db:

```sql
create database my-database;
```

## switch to different database in psql shell

- `\connect my-database;` - switch to different db inside psql
- `\dt` - list tables in psql

## postgresql equivalent of mysql's `select database();`

`select current_database();`

## create table

```sql
CREATE TABLE [IF NOT EXISTS] table_name (
   column1 datatype(length) column_constraint,
   column2 datatype(length) column_constraint,
   column3 datatype(length) column_constraint,
   table_constraints
);
CREATE TABLE [IF NOT EXISTS] table_name (
	user_id serial PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 50 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);
```

## foreign key

```sql
CREATE TABLE students
(
  student_id SERIAL PRIMARY KEY,
  player_name TEXT
);
CREATE TABLE tests
(
  subject_id SERIAL,
  subject_name text,
  highestStudent_id integer,
  constraint fk_tests_students
     foreign key (highestStudent_id)
     REFERENCES students (student_id)
);
```

for other ways to declare FK check: [stackoverflow - postgresql-foreign-key-syntax](https://stackoverflow.com/questions/28558920/postgresql-foreign-key-syntax)


## add a column to existing table

```sql
-- syntax: alter table <table_name> add column <column_name> <data_type_name>;
alter table users add column joined_on date;

-- adding jsonb column
alter table users add column the_json_data jsonb default '{}'::jsonb;
```

## update column

```sql
-- syntax: alter table <table_name> add column <column_name> <data_type_name>;
alter table users add column middle_name VARCHAR (50);
alter table users alter column joined_on type timestamp;
```

## bulk update trick

- first create temp_table on the fly:

  ```sql
  select * from (
    values (1, 'Nature photo 01','-1, -100'::point), (2, 'Nature photo 02', '-2, -200'::point)
  ) as temp_table(id, geo)
  ```

- join temp table and update:

  ```sql
  update photo
  set geo = temp_table.geo,
  name = temp_table.name
  from (
    values
    (1, 'Nature photo 01', '-1, -100'::point),
    (2, 'Nature photo 02', '-2, -200'::point)
  ) as temp_table(id, name, geo)
  where photo.id = temp_table.id
  ```

## show tables

```sql
SELECT tablename
FROM pg_catalog.pg_tables
WHERE schemaname != 'pg_catalog' AND 
    schemaname != 'information_schema';
```

## length of an array

cardinality

```sql
select 
	list1,
	list2,
	cardinality(list1),
	cardinality(list2),
	cardinality(list1) + cardinality(list2)
from my_table mt;
```

## number of times a character repeated

```sql
-- how many times 'A' repeated?
select
  column_name,
  (CHAR_LENGTH(column_name) - CHAR_LENGTH(REPLACE(column_name , 'A', ''))) as count
  from my_table mt
```

## postgres add constraint:

- with create table

  ```sql
  CREATE TABLE order_details
  ( order_detail_id integer CONSTRAINT order_details_pk PRIMARY KEY,
    order_id integer NOT NULL,
    order_date date,
    quantity integer,
    notes varchar(200),
    CONSTRAINT order_date_unique UNIQUE (order_id, order_date)
  );
  ```

- with update table

  ```sql
  ALTER TABLE table_name
  ADD CONSTRAINT constraint_name UNIQUE (column1, column2, ... column_n);
  ```

## updating one table from other table

```sql
UPDATE bbb as b
SET column1 = a.column1,
  column2 = a.column2,
  column3 = a.column3
FROM aaa as a
WHERE a.id = b.id
AND b.id = 1
```

## update using join

```sql
UPDATE table1 t1
SET some_t1_field = t4.some_t4_field
FROM table2 t2
LEFT join table3 t3 ON t3.some_id = t2.some_t2_field
LEFT join table4 t4 ON t4.some_t4_field = t3.some_t3_field
WHERE t2.some_t2_field = t1.some_t1_field
AND t1.some_t1_field IS NULL
AND t4.some_t4_field IS NOT NULL
```

## date time format (to_char())

```sql
-- yyyy-mm-dd hh:mm:ss format
select to_char(date_field, 'YYYY-MM-DD HH24:MI:SS')
from my_table;
```

## string concatenation (|| operator)

[link: postgres concat](https://www.techonthenet.com/postgresql/functions/concat2.php)<br>
syntax: `string1 || string2 || string_n`

```sql
postgres=# SELECT 'a' || 'b' || 'c' || 'd' AS result;
 result
--------
 abcd
(1 row)
```

## List all the columns (of db, of table)

```sql
select
	table_catalog
	, table_schema
	, table_name
	, column_name
FROM
	information_schema.columns
where true
	and table_catalog = 'my_db'
--	and table_schema = 'public'
--	AND table_name = 'my_table'
	and column_name like '%%'
```

## set next sequence number (serial/nextval)

```sql
-- get current max value:
SELECT MAX(<column-name>) FROM <table-name>;
-- get next sequence value:
SELECT nextval('<table-name>_<column-name>_seq');
-- if next sequence value is wrong, then correct it by:
SELECT setval('<table-name>_<column-name>_seq', (SELECT MAX(<column-name>) FROM <table-name>)+1);
```

## view timezone list (with more data)

```sql
SELECT * FROM pg_timezone_names;
```

## filtering based on computed column

[stackoverflow](https://stackoverflow.com/a/32188613)

```sql
with t as (
  select id, cos(id) + cos(id) as op
  from myTable
)
select *
from t
where op > 1;
```

## the && operator in postgres

[docs](https://www.postgresql.org/docs/9.3/functions-range.html)<br>
&& overlap operator (have points in common)<br>
ex:  	int8range(3,7) && int8range(4,12) =====> returns true

## rename column

```sql
ALTER TABLE table_name 
RENAME COLUMN column_name TO new_column_name;
```

## extensions directory

`<postgres_installation_dir>/share/extension/`

## view max connections

```sql
select * from pg_settings
where name='max_connections'
```

## regex (~*)

```sql
select * from my_table
where my_column ~* 'regex_pattern_goes_here'
```

## string value does not start with

```sql
select * from my_table
where NOT my_column ~* '^pg_'
```

## insert ... on conflict update

[docs - on conflict](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT)

```sql
INSERT INTO "student" ("name","marks","roll_no")
VALUES
('student 1', '86', '01')`,
('student 2', '74', '02')`,
('student 3', '76', '03')`,
ON CONFLICT (roll_no) DO
UPDATE
SET
  "name" = "excluded"."name",
  "marks" = "excluded"."marks",
  "deleted_on" = null;
```

## on conflict do nothing

```sql
INSERT INTO customers (name, email)
VALUES('Microsoft','hotline@microsoft.com') 
ON CONFLICT (constraint_name) 
DO NOTHING;
```

## unique constraint

```sql
CREATE TABLE table_name
(
  column1 datatype [ NULL | NOT NULL ],
  column2 datatype [ NULL | NOT NULL ],
  ...
  CONSTRAINT constraint_name UNIQUE (uc_col1, uc_col2, ... uc_col_n)
);
```

OR

```sql
ALTER TABLE table_name
ADD CONSTRAINT constraint_name UNIQUE (column1, column2, ... column_n);
```

## sha1 or md5

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
select encode(digest('a'::bytea, 'md5'), 'hex');
select encode(digest('a'::bytea, 'sha1'), 'hex');
```

## show all ()

```sql
-- will print all the variables
show all;
```

## dump & restore

```sh
pg_dump --host <hostname> --port 5432 --username <username> --format custom --verbose --file "./my-file.backup" --table public.<table_name> <table_name>
pg_restore -h <host> -p 5432 -U <username> -d <table_name> my_file.backup
```

## remove nested fields from jsonb

```sql
select
info #- '{k6,addr,tq}' #- '{k6,addr,pin}'
from json_field_update

update json_field_update
set info = info #- '{k6,addr,tq}' #- '{k6,addr,pin}'
```

## updating jsonb nested field

- need to use `jsonb_set`
- `jsonb_set(target jsonb, path text[], new_value jsonb [, create_missing boolean])`
- [docs - json functions](https://www.postgresql.org/docs/9.5/functions-json.html)

example:

```sql
update json_field_update
set info = jsonb_set(info, '{"k6","addr","contact","email"}', '"bbb@example.com"', false)
from maping m
where m.old_email = trim('"' from (json_field_update.info->'k6'->'addr'->'contact'->'email')::text)

update json_field_update
set info = jsonb_set(info, '{"k6","addr","contact","email"}', ('"'||m.new_email||'"')::jsonb, false)
from maping m
where m.old_email = trim('"' from (json_field_update.info->'k6'->'addr'->'contact'->'email')::text)
```
