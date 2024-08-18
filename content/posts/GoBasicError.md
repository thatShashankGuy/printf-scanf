---
title: Go Basics - Error as values
author: Shashank Shekhar
date: 2023-10-29
---
![Go](/Go.png "Go")

Error Handling in Go is bit different than traditional way you must have seen in programming in languages like JavaScript . Instead of traditional "Try/Catch" Go use something called error as values. 

Go, like most statically-typed languages, mandates that you define the return type of your functions. In order to understand Error handling we must first understand return types .

Let's dive in by creating a basic function, demoFunc, that accepts a string argument and returns it in all lowercase letters. Here's how it's done:

import "strings"

```go
func demo(st string) string {

    return strings.ToLower(st)

}
```
In Go, you must specify the function's return type. If a function is designed to return a string, you must declare it explicitly, as seen above. Functions without a return type are considered "void" by default, like your typical main function.

Here’s an example of calling our function and printing the result:

```go 
func main() {

    res := demo("CAPS")

    print(res) // The result will be "caps".

}
```

But what happens when there's a possibility of an error occurring during our function's operation? That's where Go's unique approach to error handling comes into play.

In Go, there are no "try/catch" blocks. Instead, it treats errors as values that the functions return when something goes awry. This concept means you'll often see functions designed to return an "error" type alongside the expected result.

Let's modify our demoFunc to handle a scenario where the input string doesn’t contain any uppercase letters. We'll use a helper function containsUpperCase to check for uppercase letters:

```go
import "unicode"

func containsUpperCase(str string) bool {

    for _, ch := range str {

        if unicode.IsUpper(ch) {

            return true

        }

    }

    return false

}
```

Now, let's adjust our demo function to return an error if there's no uppercase character:
```go
import (

    "errors"

    "strings"

)

func demo(st string) (string, error) {

    if !containsUpperCase(st) {

        return "", errors.New("string contains no upper case characters")

    }

    return strings.ToLower(st), nil // nil here indicates that there was no error.

}
```
In the updated demo function, we introduced a new return type: "error". If the function encounters an issue (like no uppercase letters), it returns an error instead of a regular string. The nil accompanying a successful execution represents the absence of an error.

Here’s how you would handle errors when calling demo:

```go
import "fmt"

func main() {

    res, err := demo("caps")

    if err != nil {

        fmt.Println("Error:", err)

    } else {

        fmt.Println("Result:", res)

    }

}

```
In the revised main function, we check if err is not nil. If so, it indicates an error occurred, and we handle it (for example, by logging it). This pattern replaces the traditional "try/catch" block found in many other programming languages.

In summary, Go adopts a straightforward approach to error handling that's baked into the language's design, promoting the handling of errors as regular return values. 

Thank you for reading, and I hope this helps you in understanding error handling in Go. Your feedback is invaluable and helps enhance the quality and clarity of this content. Stay tuned for more insights into Go and other programming paradigms!