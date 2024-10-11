---
title: Profiling Your Node.js Production Code
author: Shashank Shekhar
date: 2024-08-04
---

![Nodejs](/nodeJS.svg "Node")

### Introduction

When building and running code on a production server, it's crucial to be aware of memory usage, CPU cycles, and other key performance indicators (KPIs) like the time complexity and duration of function calls. Software engineers often obtain and analyze these KPIs to optimize running programs and debug issues, such as memory leaks and CPU utilization, which are difficult to catch in a development environment. This activity is called **profiling**.

Profiling is achieved by instrumenting either the program's source code or its binary executable form using a tool called a **profiler**. Profilers may use various techniques, such as **event-based, statistical, instrumented, and simulation methods**.

### Statistical Profiling

In this article, we will focus on statistical profiling in Node.js programs. 

In statistical profiling, the profiler interrupts the execution of a program at random intervals and checks where the instruction pointer is. The number of times the pointer stops in each function’s block is roughly proportional to the total time spent executing these functions. You can also gather other useful information, such as finding out which functions are called by which functions by inspecting the call stack.

With definitions out of the way, let's demonstrate a simple profiling exercise using a small Node.js program.

### Program to Profile

Our program is a simple function that takes an image, compresses it, and outputs a zip file of the compressed image.

We use two libraries, `sharp` and `archiver`, to streamline our code. You can install these via the following command:

```bash
npm install sharp archiver 
```

Below is the code. I am using a single `app.mjs` file to execute the function:

```javascript
import fs from 'fs';
import sharp from 'sharp';
import archiver from 'archiver';

async function compAndZip() {
    try {
        await sharp('image.jpg').resize(800, 600, { fit: 'inside' }).toFile('compressed_image.jpg');

        const output = fs.createWriteStream('zipped_image.zip');
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
            console.log('Zip successful');
        });

        archive.pipe(output);
        archive.file('compressed_image.jpg', { name: 'compressed_image.jpg' });
        await archive.finalize();
    } catch (error) {
        console.log(`Error while archiving and compressing: ${error.message}`);
    }
}

compAndZip();
```

*Note: To keep things simple, my function does not take any arguments. Instead, it expects the input file to be in the same directory and generates the two output files in the same directory as well. You can update the code to pass input and output paths as arguments.*

### Explanation

The `compAndZip` function uses `sharp` to compress and resize the image, and `archiver` to archive the file in `zip` format. It uses Node's `zlib` utility library for compression.

### Profiling the Program

While there are many third-party options, the goal of this article is to explore the built-in tools and utilities provided by the Node.js runtime.

Node.js provides a built-in profiler that uses the profiler inside V8, which samples the stack at regular intervals during program execution (statistical profiling). It records the results of these samples, along with important optimization events such as JIT compiles, as a series of ticks (see tick file example below).

We can illustrate the tick profiler using our program.

By default, the environment for all Node.js programs is set to development. To run your program in a production environment, you need to explicitly set the `NODE_ENV` value to `production`.

Let's run our profiler in a production environment using a bash terminal:

```bash 
NODE_ENV=production node --prof app.mjs
```

This generates a tick file as described above.

```log
code-creation,Builtin,2,4958,0x1013e0fe0,724,Construct_Baseline
code-creation,Builtin,2,4958,0x1013e12c0,728,Construct_WithFeedback
code-creation,Builtin,2,4958,0x1013e15a0,540,JSConstructStubGeneric
code-creation,Builtin,2,4958,0x1013e17c0,448,JSBuiltinsConstructStub
```

Since we ran our application using the `--prof` option, a tick file was generated in the same directory as your local run of the application. It should have the form `isolate-0xnnnnnnnnnnnn-v8.log` (where `n` is a digit).

Going through the file, you will see a lot of unreadable data. **To make sense of this file, we need to use the tick processor bundled with the Node.js binary**. To run the processor, use the `--prof-process` flag:

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed_profile.txt
```

I am saving the processed profile in `processed_profile.txt`, but you can name it whatever you want.

For the file I generated, the command looked like this (though the file name will be different for each profile):

```bash
node --prof-process isolate-0x148008000-10352-v8.log > processed_profile.txt  
```

Below is the profile:

```log
Statistical profiling result from isolate-0x148008000-10352-v8.log, (268 ticks, 251 unaccounted, 0 excluded).

 [Shared libraries]:
   ticks  total  nonlib   name
     17    6.3%          /Users/shashankshekhar/.nvm/versions/node/v20.10.0/bin/node

 [JavaScript]:
   ticks  total  nonlib   name

 [C++]:
   ticks  total  nonlib   name

 [Summary]:
   ticks  total  nonlib   name
      0    0.0%    0.0%  JavaScript
      0    0.0%    0.0%  C++
      3    1.1%    1.2%  GC
     17    6.3%          Shared libraries
    251   93.7%          Unaccounted
```

### Analyzing the Profile

**High Unaccounted Ticks (93.7%)**: The majority of the ticks (93.7%) are unaccounted for, suggesting that the profiler was unable to attribute these ticks to specific functions or libraries.

**Shared Libraries (6.3%)**: A small portion of the ticks is attributed to shared libraries. This includes the Node.js runtime itself.

**Garbage Collection (1.1%)**: A minor portion of ticks is spent on garbage collection, indicating that memory management is not a significant performance concern in this run.

**JavaScript and C++ Execution (0.0%)**: No ticks were attributed directly to JavaScript or C++ code execution.

### Conclusion

The program itself is very small and fast, and I did not find many concerns with the profile. However, as demonstrated here, we can optimize our code based on the data provided, such as GC and unaccounted ticks.

I hope this gives you an idea of the use of profilers, the advantages of profiling your program in production, and an introduction to Node.js's built-in profiler.

Thank you for reading, and I will see you in the next post soon. Happy coding! Cheers!!!

***FootNotes** : Code example provided here can be accessed at my [Github Repo - Node Profiler](https://github.com/thatShashankGuy/code-examples/tree/master)*