---
title: Building Web APIs in Go - StoreFM#2 
author: Shashank Shekhar
date: 2024-08-25
---
![Go](/Go.png "Go")

This is a continuation of the **Store FM** series, where we discuss web application development with Go and analyze the Go standard library. In the [previous article](/posts/storefm1), we set up our project with a Go backend and an HTML+HTMX frontend.

Today, we will be analyzing how to work with various API endpoints through which our frontend interacts with the server.

We will focus on three packages from the standard library in this article:
- `fmt`
- `net/http`
- `html/template`

The FM Store source code can be accessed at this [GitHub repo](https://github.com/thatShashankGuy/printf-scanf-labs/tree/master/storeFM).

### Formatting I/O with fmt

---

The `fmt` package implements formatted I/O with functions analogous to C's `printf` and `scanf`.

Format verbs identify the data type provided as the second argument, similar to how C handles its formatter functions. The list of format verbs is extensive and can be found in the Go official documentation. Below are some of the most commonly used format verbs:

```go
%t  the word true or false
%f  decimal point but no exponent, e.g., 123.456
%s  the uninterpreted bytes of the string or slice
%q  a double-quoted string safely escaped with Go syntax
%p  base 16 notation, with leading 0x
%d  base 10 integer
```

Formatter functions usually take two arguments: the message, followed by the variable whose value is appended to the message.

The `fmt` package has multiple functions for different scenarios. Here are some of the most widely used:

- **To print to the terminal:**
  - `fmt.Println`: Prints the arguments with a newline at the end.
  - `fmt.Printf`: Prints the formatted string according to a format specifier.
  
- **To format a string and use it as a variable/value:**
  - `fmt.Sprintf`: Returns a formatted string without printing it.
  - `fmt.Fprintln`: Writes the arguments to a specified writer (like `os.Stdout`), with a newline.
  - `fmt.Fprintf`: Writes a formatted string to a specified writer.
  
- **To scan values from terminal inputs:**
  - `fmt.Scan`: Reads space-separated values from standard input.
  - `fmt.Scanln`: Reads space-separated values from standard input, stopping at a newline.
  - `fmt.Scanf`: Reads input based on a format specifier.
  - `fmt.Sprint`: Returns the concatenated string of arguments without any formatting.

- **To print errors:**
  - `fmt.Errorf`: Returns an error that formats like `fmt.Sprintf`.

We can see a couple of examples in FM Store's `main` function: when the server starts, our program prints a message with the port number, and again if we encounter any error while starting the server.

```go
func main() {
	const PORT = ":8080"
	http.HandleFunc("/", listFileHandler)
	http.HandleFunc("/play", playFileHandler)
	http.Handle("/store/", http.StripPrefix("/store/", http.FileServer(http.Dir("../store"))))
	err := http.ListenAndServe(PORT, nil)

	if err != nil {
		errorMessage := fmt.Errorf("error during server initialization: %v", err)
		fmt.Println(errorMessage)
	} else {
		fmt.Printf("Server is running at %v\n", PORT)
	}
}
```

To provide a readable error, we have used `fmt.Errorf`. You can see this in action—if you try running a second instance of the server on your machine, you will see the following error:

```sh
❯ go run main.go 
error during server initialization: listen tcp :8080: bind: address already in use
```

Note that `fmt.Sprintf` should be used for similar non-error-based use cases. 

Next, let's focus on how to start a backend server and build API endpoints.



### API Endpoints with Go - net/http

---

The `http` package provides HTTP client and server implementations. By default, Go supports the HTTP/2 protocol. The differences between HTTP/1 and HTTP/2 are beyond the scope of this article, but we may discuss them in a future article.

The `ListenAndServe` function starts an HTTP server with a given address and handler. The handler is usually `nil`, which tells Go to use `DefaultServeMux` and allows `HandleFunc` or `Handle` functions to be added to it.

`ServeMux` is an HTTP request multiplexer. It matches the URL of each incoming request against a list of registered patterns and calls the handler for the pattern that most closely matches the URL.

`DefaultServeMux` is the default value of `ServeMux`.

Both `http.Handle` and `http.HandleFunc` implement an interface called `http.Handler`.

The `http.Handler` interface requires implementing a single method: `ServeHTTP(ResponseWriter, *Request)`.

`Handle` allows you to register a route with a custom handler.

`HandleFunc` simplifies the process of creating a handler by allowing you to pass a function with the signature `func(http.ResponseWriter, *http.Request)` instead of requiring you to define a custom type that implements the `http.Handler` interface.

Looking at the `main` function again, we provided the address (PORT) as the first argument and `nil` as the second argument for `ListenAndServe`.

For our methods—two GET methods—we are using two functions: `listFileHandler` and `playFileHandler`, passed in `http.HandleFunc`. 
- `listFileHandler` serves the landing page as defined by the default route of `"/"` and lists all the audio files from the store.
- `playFileHandler` takes a query parameter appended to the route `(/play?fileName=)` to play the audio files in the browser.

We will talk more about these two functions when we discuss the `os` and `html/template` packages.

The third GET API `("/store/")` endpoint serves the store (object storage for our audio) directly to the client as a static folder. For that, we use the `http.Handle` method. The `StripPrefix` method strips the server path and adds `/store/` as the base directory, while the `FileServer` method serves the files from the provided server path.

```go
	const PORT = ":8080"
	http.HandleFunc("/", listFileHandler)
	http.HandleFunc("/play", playFileHandler)
	http.Handle("/store/", http.StripPrefix("/store/", http.FileServer(http.Dir("../store"))))
	err := http.ListenAndServe(PORT, nil)
```

Notice that in all three handlers, we have yet to define HTTP verbs/methods. By default, HTTP endpoints will be GET endpoints. If the method is supposed to be POST, PUT, PATCH, or HEAD, we need to specify the method and action accordingly.

### Working with HTTP Requests - http.ResponseWriter, *http.Request

---

To demonstrate how to read a request and write a response, we will add another endpoint. This time, a POST endpoint to update our front end with a like counter. The like counter increments with a "like" request and decrements if the dislike button is hit.

```go
http.HandleFunc("/like", trackLikesHandler)
```

For now, we'll print the values to the terminal, but later we will track this in a database when we work with database and ORM packages.

Here is the backend handler called `trackLikesHandler` and the HTML buttons making API calls to the server:

```go
func trackLikesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "Invalid form data", http.StatusBadRequest)
			return
		}

		likeCount, _ := strconv.Atoi(r.FormValue("likeCount"))
		dislikeCount, _ := strconv.Atoi(r.FormValue("dislikeCount"))
		fileName := r.FormValue("fileName")

		if likeCount > 0 {
			likeCounter += 1
		}
		if dislikeCount > 0 && likeCounter > 0 {
			likeCounter -= 1
		}

		fmt.Printf("Total likes for %s: %d \n", fileName, likeCounter)
		fmt.Fprintf(w, "Updated like counter: %d", likeCounter)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
```

```html
<button class="text-green-500 hover:text-green-700" 
        hx-post="/like" 
        hx-vals='{"likeCount": 1, "dislikeCount": 0, "fileName": "{{.File}}"}'
        hx-swap="outerHTML">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
</button>
<span class="text-gray-700" id="like-count"></span>
</div>
<div class="flex items-center space-x-2">
    <button class="text-red-500 hover:text-red-700" 
            hx-post="/like" 
            hx-vals='{"likeCount": 0, "dislikeCount": 1, "fileName": "{{.File}}"}'
            hx-swap="outerHTML">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 24 24">
            <path d="M12 2.65l1.45 1.32c5.15 4.68 8.55 7.76 8.55 11.54 0 3.08-2.42 5.5-5.5 5.5-1.74 0-3.41-.81-4.5-2.09C10.91 20.19 9.24 21 7.5 21 4.42 21 2 18.58 2 15.5c0-3.78 3.4-6.86 8.55-11.54L12 2.65z" />
        </svg>
    </button>
    <span class="text-gray-700" id="dislike-count"></span>
</div>
```

In the `HandleFunc` handler, we provide two arguments:
- `w http.ResponseWriter`: Used to construct and send the HTTP response back to the client.
- `r *http.Request`: Represents the incoming HTTP request, containing details such as the method, URL, headers, and body.

We check the API method with `r.Method`. The value for `r.Method` in this case is `http.MethodPost`. Based on the request type, it can be `MethodPatch`, `MethodPut`, `MethodGet`, and so on. This helps us avoid defining redundant functions for the same endpoint with multiple HTTP methods.

Notice that `r *http.Request` is a pointer to an `http.Request` struct. The pointer reference (`*http.Request`) allows the handler function to directly access and modify the data within the `http.Request` object, rather than working with a copy. This is efficient, especially for large requests, as it avoids duplicating data. We have already discussed [pointers in an earlier article](/posts/gopointers).

We receive the request as form-encoded data, which we extract using the `strconv.Atoi` function, which converts a string to an integer, returning the integer value and an error if the conversion fails.

After updating our counter, we send the details back in the response using `w`. `w` is our `ResponseWriter`, so if the method is not specified or we need to send an error back, we pass it through `w`. 

In our example, we responded with an HTTP error of "method not allowed" if the HTTP method is not POST:

```go
http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
```

### Serving Client-Side Pages with html/template

---

The last thing I want to touch upon is serving client-side code with Go. I have not used a client-side JavaScript library in FM Store. In fact, I have not written any JavaScript so far for this full-stack Go app. Instead, I have used HTMX—a small library that directly injects AJAX into HTML—and the Go templating package `html/template` to serve dynamic content like file lists.

Let’s see `html/template` in action in the `index.html` landing page served by `listFileHandler` and the handler itself.

```go
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
		http.Error(w, "Error occurred while parsing the list", http.StatusInternalServerError)
		fmt.Printf("Error listing files: %v", err)
		return
	}

	tmpl, err := template.ParseFiles("templates/index.html")

	if err != nil {
		http.Error(w, "Error occurred while parsing the HTML template", http.StatusInternalServerError)
		fmt.Printf("Error parsing files: %v", err)
		return
	}

	err = tmpl.Execute(w, list)
	if err != nil {
		http.Error(w, "Error occurred while embedding the list in the template", http.StatusInternalServerError)
		fmt.Printf("Error executing template: %v", err)
		return
	}
}
```

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

The `listFiles` function reads all the audio files from the store (object storage) and passes them to `listFileHandler`. We will discuss the filesystem when we analyze the `os` package.

Instead of sending data as a JSON object—which would then need to be parsed by JavaScript on the client side—`listFileHandler` parses the `index.html` file and embeds the list directly into the HTML using the `html/template` package, then serves this static HTML page directly to the client on API call.

You can run the following curl request to see the list data populated in the HTML. This approach is really helpful if you don't need a lot of dynamic content on your web application or if your application requires server-side rendering.

On a side note, HTMX is used to ship minimal JavaScript to the browser, making the application very fast. This is a small library, and I plan to discuss it in a future article. This approach works best for applications with minimal client-side operations and maximum server-side operations for dynamic content. You may still need to ship some JavaScript.

```bash
curl -X GET localhost:8080
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
            
            <li class="p-4 bg-white rounded-lg shadow hover:bg-pink-100 cursor-pointer flex items-center space-x-4" hx-get="/play?item=black_box.mp3" hx-target="#audio-player" hx-swap="innerHTML">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-4.586-2.768A1 1 0 009 9.234v5.532a1 1 0 001.166.98l4.586-2.768a1 1 0 000-1.732z" />
                </svg>
                <span>black_box.mp3</span>
            </li>
            
            <li class="p-4 bg-white rounded-lg shadow hover:bg-pink-100 cursor-pointer flex items-center space-x-4" hx-get="/play?item=synth_audio.mp3" hx-target="#audio-player" hx-swap="innerHTML">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-4.586-2.768A1 1 0 009 9.234v5.532a1 1 0 001.166.98l4.586-2.768a1 1 0 000-1.732z" />
                </svg>
                <span>synth_audio.mp3</span>
            </li>
            
        </ul>
        
        <div id="audio-player" class="mt-8"></div>
    </div>
</body>
</html>
```

### Conclusion 

---

With that, I hope you have gained a good understanding of three important Go packages that will help you build awesome Go backends as an application developer.

We will continue working on this application and cover more standard library functions in the next articles.

Happy Coding! Cheers!