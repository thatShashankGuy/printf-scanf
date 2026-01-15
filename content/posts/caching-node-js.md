---
title: Node.js Module Caching
author: Shashank Shekhar
date: 2025-02-04
---

![Nodejs](/nodeJS.svg "Node")

## Introduction

In this article we will discuss NodeJs process of optimize application
by caching modules. We will also discuss how Class definitions are cached, but new instances are not and
Singleton patterns allow caching class instances manually

Node.js optimizes performance by **caching imported modules** to prevent redundant execution.
This means that when a module is required or imported multiple times, it is **loaded and executed only once**—subsequent
imports simply reuse the cached version. However, same behavior does not apply to **class instances**.

Example code can be accessed at [github repo](https://github.com/thatShashankGuy/printf-scanf-labs/tree/master/node-module-caching)

## How Node.js Caches Modules

When a module is imported using `require()` (CommonJS) or `import` (ES Modules), Node.js stores it in its **module cache**.
This prevents re-executing the module every time it is imported. Following code demonstrate the module caching.

```javascript
// utils.js
console.log("Module loaded");

export function add(a, b) {
  return a + b;
}
```

```javascript
// app.js
import { add } from "./utils.js";
import { add as addAgain } from "./utils.js";

console.log(add(2, 3)); // 5
console.log(addAgain(5, 5)); // 10
```

#### **Output:**

```bash
Module loaded
5
10
```

## Class Defination Caching

**Class instances are NOT cached automatically.** However, the **class definition** is cached just like functions.
In Class definition is cached, but each new instance `new User()` creates a fresh object.

```javascript
// user.js
console.log("User module loaded");

export class User {
  constructor(name) {
    this.name = name;
  }
}
```

```javascript
// userApp.js
import { User } from "./user.js";

const user1 = new User("Goku");
const user2 = new User("Bulma");

console.log(user1.name); // Goku
console.log(user2.name); // Bulma
```

#### **Output:**

```bash
User module loaded
Alice
Bob
```

## How to Cache Class Instances (Singleton Pattern)

If we want to reuse a single instance of a class instead of creating a new one every time, we must manually implement caching.
In below example we a Singleton Class.The first import creates the instance, and subsequent imports reuse it.

```javascript
// db.js
class Database {
  constructor() {
    console.log("New Database instance created");
    Database.instance = this;
    return Database.instance;
  }
  connect() {
    console.log("Connected to database");
  }
}

export default new Database();
```

```javascript
// dbApp.js
import db1 from "./db.js";
import db2 from "./db.js";

db1.connect();
db2.connect();
console.log(db1 === db2); // true
```

#### **Output:**

```bash
New Database instance created
Connected to database
Connected to database
true
```

## Summary

This was a small article discussing caching of module in NodeJS to optimize programs. There are lot of other proceses like tree shaking to eliminate dead code, which Node Js implements to optimize application code. We will discuss more techniques in detail in later articles

Till then happy coding!

## Further reading

- [Node JS Modules](https://nodejs.org/api/modules.html)
- [Node JS Desgin Patterns(Book)](https://www.nodejsdesignpatterns.com/)
