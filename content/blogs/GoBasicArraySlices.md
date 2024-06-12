---
title: Go Basics - Arrays vs Slices
author: Shashank Shekhar
date: 2023-08-11
---
With this article I have tried giving a brief overview of two fundamental data structures in the Go programming language: arrays and slices. This may help anyone coming from a dynamic language to Go and understand the basics of couple of most used data structures in all programs . 

Arrays

Arrays are fundamental data structures in the Go programming language that allow you to store and manage collections of elements of the same type. An array is a fixed-size sequence that holds a contiguous block of memory, where each element can be accessed using its index. Arrays provide an efficient way to store and manipulate data when you know the exact number of elements you need to manage.

In Go, arrays are inherently homogeneous, meaning they can only hold elements of the same data type.

For example, you can declare an array of integers as follows:

```go
numbers := [5]int{10, 20, 30, 40, 50}
strings:= [5]string {"jupiter", "Pluto", "Mars", "Saturn", "Venus"} 
```
Slices

Slices in Go are similar to JavaScript's arrays or Python's lists. Unlike arrays, which have fixed sizes, slices allow for the creation of sequences that can grow or shrink as needed. This adaptability is particularly valuable when dealing with variable-length data sets or scenarios where the exact number of elements is uncertain, making slices more commonly used than arrays directly.

Here is an example of creating slices in Go:

```go
numbers := []int{10, 20, 30, 40, 50}
strings := []string{"jupiter", "Pluto", "Mars", "Saturn", "Venus"} 
```

Notice how we do not declare a size for slices as we do with arrays.In Go, slices are usually homogeneous, meaning they only contain elements of the same type. However, you can achieve heterogeneity by using a slice of empty interfaces, denoted as []interface{}.

For example, you can create a heterogeneous slice like this:

```go
heterogeneousSlice := []interface{}{
    42,           // int
    "Hello",      // string
    3.14,         // float64
    true,         // bool
    []int{1, 2},  // slice of int
    map[string]int{"a": 1, "b": 2}, // map
} 
```
Underlying Arrays of Slices

The underlying array of slices refers to how slices are implemented in Go. When a slice is created, it doesn't store the data directly. Instead, it contains a reference to an underlying array, and it keeps track of where its portion of that array begins and ends.

Think of the underlying array as a large storage area. When you create a slice, you're essentially defining a subset of that storage area. The slice's start and end positions in the underlying array are determined by the index you provide when you create the slice. This array is not directly accessible, as we have not declared and initialized it ourselves, but it is created when we create a slice. Of course, we can always create a slice out of an array we declared.
```go
// Declare an array of integers
numbers := [5]int{10, 20, 30, 40, 50}
// Create slices from the array
slice := numbers[1:4] 
```

One significant difference between arrays and slices is that we cannot compare slices directly using the == operator. While arrays are values, slices are references to underlying arrays. Therefore, comparing slices using == would compare the references, not the contents. If you need to compare the contents of slices, you must loop through the elements and compare them individually.

Cap vs Len The built-in make function is a convenient tool for creating slices. By specifying the type and capacity, a new slice is initialized and ready to be populated with elements.

``` go
b := make([]int, 0, 5) // len(b)=0, cap(b)=5

b = b[:cap(b)] // len(b)=5, cap(b)=5
b = b[1:]      // len(b)=4, cap(b)=4
```

If you notice, make takes three arguments - type, length, and capacity, where the last argument (capacity) is optional. Let's discuss how capacity is different from the length of a slice.

A slice is an abstraction that uses an array underneath.

cap tells you the capacity of the underlying array, while len tells you how many items are in the array.

The slice abstraction in Go is very nice because it resizes the underlying array for you. Since arrays in Go cannot be resized, slices are almost always used instead.

Example:
``` go
s := make([]int, 0, 3)
for i := 0; i < 5; i++ {
    s = append(s, i)
    fmt.Printf("cap %v, len %v, %p\\n", cap(s), len(s), s)
} 
```
Will output something like this:
```bash
cap 3, len 1, 0x1040e130
cap 3, len 2, 0x1040e130
cap 3, len 3, 0x1040e130
cap 6, len 4, 0x10432220
cap 6, len 5, 0x10432220 
```
In conclusion, arrays and slices are both essential data structures in Go that allow you to store and manage collections of elements. Arrays provide an efficient way to store and manipulate data when you know the exact number of elements you need to manage, while slices are more flexible and adaptable when dealing with variable-length data sets. Understanding the differences between these data structures is crucial to write efficient, maintainable Go code.
