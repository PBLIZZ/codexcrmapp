### rules

# TypeScript/JavaScript Coding Standards

## Type Safety Rules

- **NEVER use the `any` type** - it defeats the purpose of TypeScript's type safety
- Files using `any` will fail lint checks with `@typescript-eslint/no-unsafe-*` errors
- Always use proper type guards and type assertions instead of `any`
- Prefer `unknown` over `any` when the type is truly unknown
- Use type guards like `instanceof Error` to safely handle error objects
- ESLint cannot auto-fix `no-unsafe-*` errors because they require developer decisions
- Always properly type function return values, especially for error handling

## Error Handling

- Error objects should be typed as `Error | null`, not `any`
- Use `instanceof Error` checks before accessing error properties
- Never access `.message` on untyped error objects

# Postgres SQL Style Guide

## General

- Use lowercase for SQL reserved words to maintain consistency and readability.
- Employ consistent, descriptive identifiers for tables, columns, and other database objects.
- Use white space and indentation to enhance the readability of your code.
- Store dates in ISO 8601 format (`yyyy-mm-ddThh:mm:ss.sssss`).
- Include comments for complex logic, using '/_ ... _/' for block comments and '--' for line comments.

## Naming Conventions

- Avoid SQL reserved words and ensure names are unique and under 63 characters.
- Use snake_case for tables and columns.
- Prefer plurals for table names
- Prefer singular names for columns.

## Tables

- Avoid prefixes like 'tbl\_' and ensure no table name matches any of its column names.
- Always add an `id` column of type `uuid` unless otherwise specified.
- Create all tables in the `public` schema unless otherwise specified.
- Always add the schema to SQL queries for clarity.
- Always add a comment to describe what the table does. The comment can be up to 1024 characters.

## Columns

- Use singular names and avoid generic names like 'id'.
- For references to foreign tables, use the singular of the table name with the `_id` suffix. For example `user_id` to reference the `users` table
- Always use lowercase except in cases involving acronyms or when readability would be enhanced by an exception.

#### Examples:

```sql
create table sessions (
  id uuid generated always as identity primary key,
  title text not null,
  contact_id uuid references contacts (id)
);
comment on table sessions is 'A list of all the sessions for each contact.';
```

## Queries

- When the query is shorter keep it on just a few lines. As it gets larger start adding newlines for readability
- Add spaces for readability.

Smaller queries:

```sql
select *
from sessions
where end_date is null;

update sessions
set end_date = '2023-12-31'
where employee_id = 1001;
```

Larger queries:

```sql
select
  full_name,
  social_handles,
from
  sessions
where
  start_date between '2021-01-01' and '2021-12-31'
and
  status = 'attended';
```

### Joins and Subqueries

- Format joins and subqueries for clarity, aligning them with related SQL clauses.
- Prefer full table names when referencing tables. This helps for readability.

```sql
select
  sessions.title,
  contacts.full_name,
from
  sessions
join
  contacts on sessions.contact_id = contacts.id
where
  sessions.start_date > '2022-01-01';
```

## Aliases

- Use meaningful aliases that reflect the data or transformation applied, and always include the 'as' keyword for clarity.

```sql
select count(*) as total_sessions
from sessions
where end_date is null;
```

## Complex queries and CTEs

- If a query is extremely complex, prefer a CTE.
- Make sure the CTE is clear and linear. Prefer readability over performance.
- Add comments to each block.

```sql
with session_contacts as (
  -- Get all sessions and their contacts
  select
    sessions.id,
    sessions.title,
    contacts.full_name,
    contacts.social_handles
  from
    sessions
  join
    contacts on sessions.contact_id = contacts.id
),
session_counts as (
  -- Count how many sessions in each department
  select
    full_name,
    count(*) as num_sessions
  from
    session_contacts
  group by
    full_name
)
select
  full_name,
  num_sessions
from
  session_counts
order by
  full_name;
```
