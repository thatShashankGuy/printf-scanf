---
title: Nullish Coalescing (`??`) vs. Logical OR (`||`) in JavaScript
author: Shashank Shekhar
date: 2025-09-08
---

![JS Image](/javascript2.png "js")

JavaScript is the language of the web. This dual role requires it to constantly evolve with new features while maintaining backward compatibility so older websites don't break. This means that adopting modern, improved features is the developer's responsibility.

You'll still find outdated practices, like using `var`, in brand-new codebases in 2025. Today, we'll focus on one modern feature that should be strictly adopted: using the **Nullish Coalescing operator (`??`)** in place of the **Logical OR (`||`)** for providing default values.

### What is the Logical OR (`||`) Operator?

The Logical OR (`||`) operator is often used as a safeguard to prevent your program from producing unintended "falsy" values. In JavaScript, a **falsy** value is a value that is considered `false` in a boolean context.

The primary falsy values are:

- `undefined`
- `null`
- `NaN` (Not a Number)
- `0`
- `""` (empty string)
- `false`

Let's look at a common bug. The code below tries to access a property (`speed`) that doesn't exist on the `record` object.

```javascript
const record = { duration: 10 };

// record.speed is undefined. undefined / 6 results in NaN.
const time = record.speed / 6;

console.log(`The value of time is ${time}`); // Output: The value of time is NaN
```

Bugs involving `NaN` can be tricky to trace. You can use the `||` operator to provide a default value and prevent a falsy result.

```javascript
const record = { duration: 10 };

// If record.speed is falsy (like undefined), it uses 0 instead.
const time = (record.speed || 0) / 6;

console.log(`The value of time is ${time}`); // Output: The value of time is 0
```

Here, `||` checks if `record.speed` is falsy. Since it's `undefined`, the expression defaults to `0`, protecting our calculation.

---

### What is the Nullish Coalescing (`??`) Operator?

The **Nullish Coalescing (`??`)** operator does a similar job but is much more specific. It only triggers a default value if the left-hand side is **nullish**, meaning strictly `null` or `undefined`. It ignores all other falsy values.

Let's see it in action.

```javascript
const response = null;
console.log(response ?? "No response found!");
// Output: No response found! (null is handled)

// An operation that results in NaN
const falsyResponse = 0 / 0;
console.log(falsyResponse); // Output: NaN

console.log(falsyResponse ?? "This will not be shown.");
// Output: NaN (NaN is not nullish, so it's kept)
```

The `??` operator correctly provided a default for `null`, but it let the `NaN` value pass through. This is a feature, not a bug. It prevents you from accidentally hiding legitimate issues where a value is, for example, `0` or an empty string `""` but is not `null` or `undefined`.

---

### So, When Should You Use Which? 🤔

The key difference is how they treat falsy values that aren't `null` or `undefined`.

- **Use `??` (Nullish Coalescing)** when you want to provide a default **only when a value is `null` or `undefined`**. This is often the safest choice, especially when values like `0`, `""`, or `false` are valid inputs.

- **Use `||` (Logical OR)** when you want **any falsy value** to be replaced by a default. This can be useful, but it can also lead to bugs if not used carefully.

Let's look at a final, clear comparison.

```javascript
const d = 5 / "a"; // This results in NaN

// || treats NaN as falsy and replaces it
const resultWithOr = d || "Default value";
console.log(`Result with || -> ${resultWithOr}`);
// Output: Result with || -> Default value

// ?? sees that NaN is not null or undefined, and keeps it
const resultWithNullish = d ?? "Default value";
console.log(`Result with ?? -> ${resultWithNullish}`);
// Output: Result with ?? -> NaN
```

Hopefully, you now have a clearer understanding of when to use each of these powerful operators.

See ya and happy coding\!

### Reference and further Reading

- [Nullish coalescing operator (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [Logical OR (||)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR)
