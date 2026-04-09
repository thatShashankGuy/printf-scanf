---
title: "PostgreSQL Extensions"
author: Shashank Shekhar
date: 2026-04-04
draft: true
---

## What are Extensions 

PostgreSQL added support for extensions in version 9.1. These extensions can be loaded into a database to add new functionalities without modifying the core engine.

Before extensions, we had contrib modules for similar purposes, but extensions provided a cleaner way to track dependencies and standardized the process.

Many extensions come with the standard installation of PostgreSQL. Here are some extensions that come with PostgreSQL 18:

```sql
postgres=# SELECT * FROM pg_available_extensions LIMIT 5;
      name       | default_version | installed_version |                           comment
-----------------+-----------------+-------------------+-------------------------------------------------------------
 refint          | 1.0             |                   | functions for implementing referential integrity (obsolete)
 unaccent        | 1.1             |                   | text search dictionary that removes accents
 btree_gin       | 1.3             |                   | support for indexing common datatypes in GIN
 ltree           | 1.3             |                   | data type for hierarchical tree-like structures
 tsm_system_rows | 1.0             |                   | TABLESAMPLE method which accepts number of rows as a limit
```

## Loading Extensions

The `CREATE EXTENSION` command loads a new extension into the current database. There must not be an extension of the same name already loaded.

Let's load an extension `uuid-ossp` into our database. This extension helps generate UUID primary keys for PostgreSQL tables. Note that the `IF NOT EXISTS` clause makes sure that no errors are thrown if the extension is already loaded.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

The user who runs `CREATE EXTENSION` becomes the owner of the extension for purposes of later privilege checks and normally also becomes the owner of any objects created by the extension's scripts.

## Unloading Extensions

Use `DROP EXTENSION "uuid-ossp"` to unload or drop the extension from the database.
