---
title: Go Basics - Map and Structs
author: Shashank Shekhar
date: 2023-10-09
---
![Go](/Go.png "Go")

While arrays and slices form the core of sequential data structures, maps, interfaces, and structs offer unique capabilities, especially when transitioning from a language like TypeScript. Lets talk about them today.

### Maps: Go's Key-Value Store:

A map in Go is a composite type that represents a hash table or a dictionary or object/map in typescript's case. It associates keys and values where each key maps to a unique value. The key can be of any type for which the equality operation is defined, such as integers, floats, strings, etc.

```go
m := make(map[string]int) 
m["apple"] = 1 
m["banana"] = 2
```

### Maps and JSON : Marshaling and Unmarshaling of Data

Given the nature of maps, they easily translate to JSON objects. The Go standard library provides easy-to-use encoding and decoding capabilities for this.

```go
import "encoding/json"

person := map[string]string{

"name": "Shashank",

"city": "Delhi,

}
jsonData, err := json.Marshal(person)

if err != nil {

panic(err)

}
fmt.Println(string(jsonData)) // Outputs: {"city":"Delhi,"name":"Shashank"}
```

### Structs: Grouping Data Together

A struct in Go is another composite type that groups together zero or more values with named fields. They're useful for defining and grouping data.

```go
type Person struct {

    Name string

    Age  int

}
```
### Structs and JSON

Marshaling a struct to JSON is straightforward, with field names being used as default keys

p := Person{Name: "may", Age: 30}

jsonData, err := json.Marshal(p)

if err != nil {

    panic(err)

}

fmt.Println(string(jsonData)) // Outputs: {"Name":"may","Age":30}

### Structs as "Classes"

Itis well known design choice of go to not support class based OOP but If you're coming from a TypeScript /C#/Java background, you may miss the class-based approach. In Go, structs combined with methods can be used to simulate classes.
```go
func (p *Person) SayHello() {

    fmt.Println("Hello, my name is", p.Name)

}

may := Person{Name: "may"}

may.SayHello() 
```

## Understanding Structs vs Classes or Objects

To draw parallels between Go's `structs` and the concept of classes in C# or objects in JavaScript, let's highlight some key points:

1. **Grouping Data**: Just like classes or objects, `structs` allow you to group related data together. Each field within a `struct` corresponds to a property or member variable.

2. **Custom Data Types**: You can create custom data types by defining your own `structs`. This is similar to defining classes with properties in C# or creating objects with properties in JavaScript.

3. **Access Control**: Go does not have access modifiers like `public`, `private`, or `protected` as in C# or TypeScript. By convention, fields starting with an uppercase letter are exported (public), while lowercase fields are unexported (private).

4. **Methods**: While Go doesn't have traditional methods associated with classes, you can define functions that operate on `structs`. These functions, called methods, can be associated with a `struct`, allowing you to perform operations on instances of that `struct`.

```go
func (p *Person) PrintName() {
    fmt.Println("Full Name:", p.FirstName, p.LastName)
}

person.PrintName() // Calling a method on a struct
```

5. **Composition**: Go supports composition through embedding other `structs`. This is similar ( but not same as) to `inheritance` in some object-oriented languages.

```go
type Employee struct {
    Person    // Embedding the Person struct
    EmployeeID int
}
```

### Conclusion

The Go programming language, with its robust yet straightforward approach to data structures and types, offers developers the tools to build efficient, maintainable applications. Whether it's the key-value pairing of maps, the behavioral contracts of interfaces, or the data grouping capabilities of structs, understanding these concepts is crucial when working with Go, especially if transitioning from TypeScript or another object-oriented language.
