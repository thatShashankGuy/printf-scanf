---
Title: Garbage Collection in JavaScript  
Author: Shashank Shekhar  
Date: 2024-08-10
---

![JS Image](/js.svg "js")

#### What is Garbage Collection?

Unlike low-level languages like C, where memory management (allocation and freeing of memory) is handled by developers, high-level languages like JavaScript manage memory automatically. JavaScript abstracts the key concepts of allocating and freeing memory by implementing various algorithms.

The process of identifying memory that has been allocated but is no longer required by the program, referred to as *garbage*, is known as *garbage collection*.

#### Garbage Collection Algorithms

There are many garbage collection algorithms, such as *Mark and Sweep*, *Reference Counting*, *Generational Garbage Collection*, and *Mark-Compact*, among others.

We will focus on the *Mark and Sweep* algorithm because it is the most widely used garbage collection method in JavaScript engines, including those used in browsers and Node.js.

Before diving into *Mark and Sweep*, let's briefly touch on its predecessor, the *Reference Counting* algorithm.

#### Reference Counting Algorithm

The core concept of garbage collection algorithms is the notion of references. In memory management, an object is said to reference another object if it can access the latter (either implicitly or explicitly).

A JavaScript object implicitly references its prototype, while it explicitly references the value of one of its properties.

This algorithm simplifies the problem from determining whether an object is still needed to determining if an object still has other objects referencing it. An object is considered "garbage," or collectible, if there are zero references pointing to it.

Let's try to understand this with some code:

```javascript
class JSObject {
  constructor(name) {
    this.name = name;
    this.refCount = 1; // Starting with a reference count of 1
  }
}

let one = new JSObject("one"); // Reference to JSObject - refCount is 1

let two = one; // Adding another reference to one - refCount is 2

let three = one; // Adding another reference to one - refCount is 3

// Removing references to the object
three = null; // refCount reduces to 2
two = null; // refCount reduces to 1

// As one is still referencing JSObject, it cannot be collected

one = null; // refCount reduces to 0

// With no references to JSObject, it can now be marked as garbage.
```

#### Limitation of Reference Counting: Circular References

A key limitation of reference counting is its inability to handle cyclic references. A circular reference occurs when two objects reference each other.

Let’s tweak our code to demonstrate this:

```javascript
class JSObject {
  constructor(name) {
    this.name = name;
    this.refCount = 1; // Starting with a reference count of 1
    this.next = null;
  }
}

// Creating two new objects with reference count 1 each
let one = new JSObject("One");
let two = new JSObject("Two");

// Both objects add a reference to each other; refCount of both is incremented by 1, making refCount 2
one.next = two;
two.next = one;

one = null;
two = null;

// Even after removing external references to both objects/nodes, their refCounts remain at 1.
// The garbage collector won't collect these objects due to the circular reference.
```

#### Mark and Sweep Algorithm

The *Mark and Sweep* algorithm redefines "an object is no longer needed" as "an object is unreachable."

The algorithm works by assuming knowledge of a set of objects called *roots*. In JavaScript, *global objects* are considered roots.

Periodically, the garbage collector starts from these roots, finds all objects that are referenced from these roots, then finds all objects referenced from those objects, and so on.

All the objects found by the garbage collector are called *reachable objects*, while the rest are considered *unreachable objects*.

The algorithm then *marks* the reachable objects and collects or *sweeps* the unreachable (unmarked) objects.

Here is a descriptive diagram to understand the algorithm:

![Mark and Sweep Image](/marksweep.png "mark and sweep")

An advantage of *Mark and Sweep* over reference counting is that circular references are not an issue because only objects not referenced by global objects are collected.

#### Implementation of Mark and Sweep

Here is a basic example of the *Mark and Sweep* algorithm. I’ve used an imaginary *heap* and *roots* to demonstrate how JavaScript works with the actual ones.

```javascript
class Node {
  constructor(name) {
    this.name = name;
    this.marked = false;
    this.ref = []; // To hold references to other nodes
  }

  addRef(node) {
    this.ref.push(node);
  }
}

class MarkAndSweepGC {
  constructor() {
    this.heap = []; // Imaginary heap for demo purposes
    this.roots = []; // JS global variables (roots)
  }

  createObject(name) {
    const node = new Node(name);
    this.heap.push(node);
    return node;
  }

  addRoot(node) {
    this.roots.push(node);
  }

  mark() {
    // Mark all reachable objects
    const traverse = (node) => {
      if (node.marked) return;
      node.marked = true;
      node.ref.forEach((ref) => traverse(ref));
    };

    this.roots.forEach((root) => traverse(root));
  }

  sweep() {
    // Sweep unmarked objects
    this.heap = this.heap.filter((node) => {
      if (!node.marked) {
        console.log(`Collecting ${node.name}`);
        return false;
      }
      node.marked = false; // Reset marked for the next GC cycle
      return true;
    });
  }

  runGC() {
    console.log("Running garbage collection...");
    this.mark();
    this.sweep();
    console.log("Garbage collection complete.");
  }
}

// USAGE
const gc = new MarkAndSweepGC();

// Create objects
const objA = gc.createObject("A");
const objB = gc.createObject("B");
const objC = gc.createObject("C");

// Set up references (A -> B, B -> C)
objA.addRef(objB);
objB.addRef(objC);

// Add roots (consider objA as a root object)
gc.addRoot(objA);

// Run the garbage collector
gc.runGC();

// Now, remove the root reference to objA
gc.roots = [];

// Run the garbage collector again
gc.runGC();
```

#### Conclusion

Garbage collection handles the freeing of allocated memory, but memory management also includes tasks like manually allocating memory to the heap and analyzing memory usage. We will discuss these topics in detail in future posts.

I hope you now have a better understanding of how JavaScript manages the memory you allocate while writing your code.

Thank you for reading, and happy coding! Cheers!!!

#### Further Reading:
- [MDN: Memory Management in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)
- [Mark and Sweep Algorithm](https://book.huihoo.com/data-structures-and-algorithms-with-object-oriented-design-patterns-in-java/html/page424.html)
- [Tracing Garbage Collection](https://en.wikipedia.org/wiki/Tracing_garbage_collection)
