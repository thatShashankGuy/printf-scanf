---
title: Working with Go's Standard Library - StoreFM#1 
author: Shashank Shekhar
date: 2024-08-18
---
![Go](/Go.png "Go")

#### Introduction

In my previous posts, we discussed Go's syntax and how it allows developers to write C-like code for modern development. While we will continue to explore the language specifications in detail, another aspect of Go that stands out is its modern standard library.

The Go standard library is simply one of the best—if not the best—I have ever used. Many quality-of-life libraries and tools that might require third-party dependencies in other languages are available out of the box in Go's standard library. This makes Go one of the most performant, lightweight, and secure tech stacks for web application development.

Although I love working with Node.js and will continue to do so, Go brings a lot of joy to programming by eliminating the worry of dependency hell and package breakages. That's not to say there are no libraries or frameworks in Go—indeed, I use Hugo, a static site generator framework built in Go, for *[Printf/Scanf](https://printf-scanf.pages.dev/)*.

However, discussing all the packages in the standard library could be a tedious task, and I don't want to simply regurgitate what's already provided in the [Go Docs](https://pkg.go.dev/std).

Instead, the best approach is a code analysis of a small web app I've written to demonstrate some key packages used in web application development. This will be a multi-part series of articles where I will discuss one package or language feature in detail, providing a good introductory understanding and implementation using this web app as an example. Below is a list of the packages used in the app, and more will be added as we develop the app further.

```Go
import (
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
)
```

Now that we've covered that, let's talk about the app—StoreFM.

#### The Web App

This app is a single script running on the server. For demonstration purposes, features are kept to a minimum, as the focus is more on the Go programming language and standard library than on the functionality of the program itself.

StoreFM reads audio files from a "Store" and serves them to the client (a browser).

There are two API endpoints:
- **GET v1/** - Reads the file names and lists them on your landing page.
- **GET v2/** - Retrieves the audio file and plays it in the browser.

We've also ensured that the files played in the browser are not downloadable. Additional APIs with POST, PUT, and PATCH calls will be added later in the app, which we will cover in a future article.

The application source code can be found in this [GitHub repo](https://github.com/thatShashankGuy/printf-scanf-labs/tree/master/storeFM).

#### Initial Setup

I'm using VS Code as my editor because the Go extension for VS Code provides excellent linting and debugging capabilities out of the box.

After [downloading and installing Go](https://go.dev/doc/install), we set up our codebase.

The following commands set up my directories:

```bash 
mkdir -p storeFM/server storeFM/store 
mkdir -p storeFM/server/template
touch storeFM/server/template/index.html storeFM/server/main.go 
```

This creates the following structure:

```bash 
|-storeFM/
|--server/
|---template/
|----index.html
|----audio-player.html
|---main.go
|--store/
|---audiofile1.mp3
|---audiofile2.mp3
```

The project `storeFM` has two main parts: the `server` and the object store named `store`.

We are serving client-side code, which will be placed in the `template` directory and directly delivered to the browser, so we don't need an external JavaScript library for the client.

This is a full-stack app, and we will be using Go's template engine to feed data to our client.

#### Creating a Web Server in Go

There are only two files in our app: `main.go`, which acts as our server, and `index.html`, which holds all our client-side HTML, CSS, and JavaScript, along with data binding with the server file. More on that later.

Here is the code for our server. Let's start the analysis from the beginning:

```go
package main

import (
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
)

const storePath = "../store"

func listFiles() ([]string, error) {

	var storeArray []string
	err := filepath.Walk(storePath, func(storePath string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			storeArray = append(storeArray, filepath.Base(storePath))
		}
		return nil
	})

	return storeArray, err
}

func listFileHandler(w http.ResponseWriter, r *http.Request) {
	list, err := listFiles()

	if err != nil {
		http.Error(w, "Error Occured While Parsing the list", http.StatusInternalServerError)
		fmt.Printf("Error listing files:%v", err)
		return
	}

	tmpl, err := template.ParseFiles("templates/index.html")

	if err != nil {
		http.Error(w, "Error Occured While Parsing the html template with list", http.StatusInternalServerError)
		fmt.Printf("Error Parsing files: %v", err)
		return
	}

	err = tmpl.Execute(w, list)
	if err != nil {
		http.Error(w, "Error Occured While Embedding the list in template", http.StatusInternalServerError)
		fmt.Printf("Error Executing template: %v", err)
		return
	}

}
func playFileHandler(w http.ResponseWriter, r *http.Request) {
	item := r.URL.Query().Get("item")
	cwd, err := os.Getwd()

	if err != nil {
		http.Error(w, "Error Occured While Playing the audio file", http.StatusInternalServerError)
		fmt.Printf("Error Playing File: %v", err)
		return
	}
	filePath := filepath.Join(cwd, storePath, item)

	file, err := os.Open(filePath)

	if err != nil {
		http.Error(w, "Error Occured While Playing the audio file", http.StatusInternalServerError)
		fmt.Printf("Error Playing File: %v", err)
		return
	}

	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		http.Error(w, "File stat error.", 500)
		return
	}
	fmt.Printf("Playing file: %s, Size: %d bytes\n", fileInfo.Name(), fileInfo.Size())
	tmpl := template.Must(template.ParseFiles("templates/audio-player.html"))
	tmpl.Execute(w, struct {
		File string
	}{
		File: "/store/" + item,
	})

}

func main() {
	const PORT = ":8080"
	http.HandleFunc("/", listFileHandler)
	http.HandleFunc("/play", playFileHandler)
	http.Handle("/store/", http.StripPrefix("/store/", http.FileServer(http.Dir("../store"))))
	fmt.Printf("Server is running at %v ", PORT)
	err := http.ListenAndServe(PORT, nil)

	if err != nil {
		fmt.Printf("Cannot Start server %v", err)
	}
}
```

For client side UI we will be using HTMX and Go's templating engine to reduce the amount of javascript in code. HTMX is not scope of this article but we will touch on that later.Code is provided below 

index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/htmx.org@2.0.2"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <title>StoreFM</title>
</head>
<body class="bg-gray-100 text-gray-900 font-sans">
    <div class="container mx-auto p-6">
        <h1 class="text-4xl font-extrabold text-center text-pink-600 mb-8">StoreFM</h1>
        <ul class="space-y-4">
            {{range .}}
            <li class="p-4 bg-white rounded-lg shadow hover:bg-pink-100 cursor-pointer flex items-center space-x-4" hx-get="/play?item={{.}}" hx-target="#audio-player" hx-swap="innerHTML">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-4.586-2.768A1 1 0 009 9.234v5.532a1 1 0 001.166.98l4.586-2.768a1 1 0 000-1.732z" />
                </svg>
                <span>{{.}}</span>
            </li>
            {{end}}
        </ul>
        <!-- This is the target where the audio player will be injected -->
        <div id="audio-player" class="mt-8"></div>
    </div>
</body>
</html>
```

audio-player.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/htmx.org@2.0.2"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <title>StoreFM - Audio Player</title>
</head>
<body class="bg-gray-100 text-gray-900 font-sans">
    <div class="container mx-auto p-6">
        <h1 class="text-2xl font-bold text-center text-pink-600 mb-4">Now Playing</h1>
        <div class="p-4 bg-white rounded-lg shadow flex items-center justify-center">
            <div class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
                <audio controls class="w-full max-w-lg rounded-lg overflow-hidden shadow-lg">
                    <source src="{{.File}}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <div class="mt-4 text-center">
                    <p class="text-gray-700 text-sm">Now playing: {{.File}}</p>
                </div>
            </div>
            
        </div>
        <div class="mt-4 text-center">
            <a href="/" class="text-pink-500 hover:text-pink-700">Back to list</a>
        </div>
    </div>
</body>
</html>

```

#### Creating a Web Service in Go

For a small app like ours, we do not need to add any external dependencies. Go supports many major functions to help you build a web app in its standard library out of the box. For larger apps with multiple endpoints, complex routing, and middleware, we can choose one of many well-built frameworks like Fiber, Gin, or Chi.

For this app, we are sticking to the standard library package `net/http`, which will be the topic of our next article. In this introductory article, we will focus on running our server.

#### Starting a Go Program

Any Go program starts in a function called `main`. This is the entry point of Go programs, which is different from a Node.js or Python program where the interpreter reads code from top to bottom. If you are familiar with C, the syntax of the `main` function is very similar to C's `main` function.

The key differences between C's `main` function and Go's `main` function are the arguments and return type.
The `main` function in C can take arguments (`argc` and `argv`) and returns an integer value, typically `0` for successful execution and other values for errors.

```c
int main(int argc, char *argv[]) {
    // C code
}
```

```go
func main() {
    // Go code
}
```

Here is the entry point of our Go program, where we will initialize our server with a PORT number:

```go
// entry point of any go program. We will initialize our server here with PORT No
func main(){
    const PORT = ":8080"

    fmt.Printf("Server is running at %v ", PORT)
    err := http.ListenAndServe(PORT, nil)

    if err != nil {
	fmt.Printf("Cannot Start server %v", err)
    }
}
```

We have already discussed error handling in Go in a [previous article](https://printf-scanf.pages.dev/posts/gobasicerror/), so we will not cover it here. The two packages, `fmt` and `http`, will be discussed in later dedicated articles.

To run a Go app, the following command is used:

```bash
cd storeFM/server
go run main.go
```

This will produce the following output:

```bash
# Output 
Server is running at :8080
```

We have successfully started our server. In the next article, we will continue setting up our web API, adding endpoints, and logging information.

See you soon—happy coding!