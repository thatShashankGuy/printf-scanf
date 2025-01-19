---
title: Using Typescript with  NodeJS Natively
author: Shashank Shekhar
date: 2025-01-19
---

![TS Image](/typescript.png "js")


Since v22.6.0, Node.js has experimental support for some TypeScript syntax via "type stripping." You can write code that's valid TypeScript directly in Node.js without needing to transpile it first.

Today, we will do a small demo and explain how "type stripping" works, allowing users to run .ts files directly with the Node.js command, without requiring a tsconfig file or  build step. Scripts for demos are available at my [Github Repo](https://github.com/thatShashankGuy/code-examples/tree/master/node-typescript-native)

## Transpilation

Most developers are familiar with transpiling TypeScript code to JavaScript. Transpilation typically relies on generating and parsing source maps to reverse-engineer code locations during debugging.

Source maps add additional overhead and are not cheap, but they are essential for debugging, as there can be mismatches between the transpiled JavaScript and the original TypeScript code.

Transpilation can be achieved using tools like tsc or swc. Developers also need to maintain a tsconfig.json file, which is used by these transpilers. The output JavaScript files depend on the configuration specified in the tsconfig.json file. For example, the target option determines the JavaScript version (e.g., ES5, ES6, etc.) to which the code is transpiled.

## Type Stripping
Type Stripping on other hand replace the removed typescript annotations with blank spaces, ensuring the original location the javascript part of the code. This means the struture of the code remains intact with more blank space. 

Type Stripping removes the need of a source map and tsconfig file to build the source map as your new JS code have same structure as TS code. 

Node.js uses a customized version of swc, a fast and lightweight transpiler written in Rust which is also used in libraries like Turbopack and Roll up. 

By stripping types, the JavaScript output is as similar as possible to the originally authored TypeScript code. This approach requires making trade-offs in the syntax that Node.js can support, ensuring the code remains compatible with the runtime while maintaining the benefits of type-checking.

Type stripping works well for TypeScript syntax that closely resembles the output JavaScript.

Node.js also refuses to process TypeScript files located in folders under the node_modules path. This is to discourage package authors from publishing packages written in TypeScript directly.

Native type-stripping support is beneficial for lightweight scripts with minimal dependency on third-party packages. However, for larger applications, traditional transpilation using libraries like ts-node or tsx is recommended.

Now on to Demo 

## Prerequisite 

In order to use this experimental feature , we need to switch to Node Version 23

Check node version by using command 
`node -- version`

We can install node v23 using `node version manger - nvm`
![nvm ss](/nvm-node-v23.png "node")

---

## Demo 
First demo we are writing a small search and replace function , with types and result functions. Scripts for demos are available at my [Github Repo](https://github.com/thatShashankGuy/code-examples/tree/master/node-typescript-native). 

```typescript

interface SearchReplaceOperation {
    text: string;
    searchValue: string | RegExp;
    replaceValue: string;
}

function searchAndReplace(operation: SearchReplaceOperation): string {
    const { text, searchValue, replaceValue } = operation;
    return text.replace(searchValue, replaceValue);
}

const originalPhrase: string = "comparing🍎 with 🍊";
const search: string = "🍊";
const replacement: string = "🍌";

const operation: SearchReplaceOperation = {
    text: originalPhrase,
    searchValue: search,
    replaceValue: replacement,
};

const newPhrase = searchAndReplace(operation);
console.log("Original Text:", originalPhrase);
console.log("Replaced Text:", newPhrase);

// Using regex
const anotherPhrase = "🐵 see 🐵 do";
const regexOperation: SearchReplaceOperation = {
    text: anotherPhrase,
    searchValue: /🐵/g,
    replaceValue: "🦍",
};

const regexPhrase = searchAndReplace(regexOperation);
console.log("Original Text:", anotherPhrase);
console.log("Regex Replaced Text:", regexPhrase);
```

In order to directly run the typescript file run, use node command with flag 
` --experimental-strip-types` like below 

```bash 
node  --experimental-strip-types searchAndReplace.ts
```
You will Notice the following result in terminal 
```bash
❯ node  --experimental-strip-types searchAndReplace.ts
Original Text: comparing🍎 with 🍊
Replaced Text: comparing🍎 with 🍌
Original Text: 🐵 see 🐵 do
Regex Replaced Text: 🦍 see 🦍 do
(node:39879) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

## Type Transform 
 
Lets write another script using enum and observe the response with regular types stripping. 

```typescript
enum ReplacementType {
    Fruits,
    Animals,
}
interface SearchReplaceOperationWithEnum {
    text: string;
    type: ReplacementType;
}

function searchAndReplaceWithEnum(operation: SearchReplaceOperationWithEnum): string {
    const { text, type } = operation;

    switch (type) {
        case ReplacementType.Fruits:
            return text.replace(/🍎|🍊/g, (match) => (match === "🍎" ? "🍌" : "🍍"));

        case ReplacementType.Animals:
            return text.replace(/🐵/g, "🦍");

        default:
            return text;
    }
}

const fruitOperation: SearchReplaceOperationWithEnum = {
    text: "comparing 🍎 with 🍊 and 🍎 again",
    type: ReplacementType.Fruits,
};

const fruitReplacedText = searchAndReplaceWithEnum(fruitOperation);
console.log("Original Text (Fruits):", fruitOperation.text);
console.log("Replaced Text (Fruits):", fruitReplacedText);

const animalOperation: SearchReplaceOperationWithEnum = {
    text: "🐵 see 🐵 do 🐵 say",
    type: ReplacementType.Animals,
};

const animalReplacedText = searchAndReplaceWithEnum(animalOperation);
console.log("Original Text (Animals):", animalOperation.text);
console.log("Replaced Text (Animals):", animalReplacedText);

```

You will notice following error in terminal 

```bash
SyntaxError [ERR_INVALID_TYPESCRIPT_SYNTAX]:   x TypeScript enum is not supported in strip-only mode
   ,-[2:1]
 1 |     
 2 | ,-> enum ReplacementType {
 3 | |       Fruits,
 4 | |       Animals,
 5 | `-> }
 6 |     interface SearchReplaceOperationWithEnum {
 7 |         text: string;
 8 |         type: ReplacementType;
   `----
```

Since Node.js is only removing inline types, any TypeScript features that involve replacing TypeScript syntax with new JavaScript syntax will error, unless the flag --experimental-transform-types is passed.

lets run the same script with passing flag --experimental-transform-types

```bash 
node  --experimental-strip-types --experimental-transform-types withEnums.ts

##OUTPUT 
Original Text (Fruits): comparing 🍎 with 🍊 and 🍎 again
Replaced Text (Fruits): comparing 🍌 with 🍍 and 🍌 again
Original Text (Animals): 🐵 see 🐵 do 🐵 say
Replaced Text (Animals): 🦍 see 🦍 do 🦍 say
(node:44473) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

## Importing modules 

Another important consideration when using multi-file scripts is that the file extension must be explicitly declared when importing modules, as you can now import both .js and .ts files.

Lets move the interface from searchAndReplace.ts to its own file and import the interface back to searchAndReplace.ts. While Importin with we must declare file extension explicitly 

```Typescript
//interface.ts 
export default interface SearchReplaceOperation {
    text: string;
    searchValue: string | RegExp;
    replaceValue: string;
}

//searchAndReplace.ts
import SearchReplaceOperation  from "./interfaces.ts"; //.ts is explictly declared

function searchAndReplace(operation: SearchReplaceOperation): string {
    const { text, searchValue, replaceValue } = operation;
    return text.replace(searchValue, replaceValue);
}
```
---

I hope this article helps you understand how to run lightweight TypeScript files without complex setups or build steps. While setting up TypeScript projects is still necessary for larger applications, this is a welcome step toward Node.js providing out-of-the-box TypeScript support, similar to other runtimes. As Always Happy Coding!


---

#### Further Reading
- [Node.js v23.6.0 documentation](https://nodejs.org/docs/latest/api/typescript.html#typescript-features)
- [Running TypeScript Natively](https://nodejs.org/en/learn/typescript/run-natively)