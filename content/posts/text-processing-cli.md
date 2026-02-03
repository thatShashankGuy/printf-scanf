---
Title: Text Processing via CLI
Author: Shashank Shekhar
Date: 2025-08-28
Draft: true
---


![shell](/awk-sed-grep.png "shell")
As IT professionals, we live in a world of text. From source code and markup to configuration files and terabytes of logs, our days are spent creating, reading, and manipulating text in its many forms—JSON, XML, CSV, and beyond.

In the last decade, our toolkits have become incredibly sophisticated. We lean heavily on powerful GUI editors like VS Code and, more recently, on LLMs to handle even minor text processing jobs. These tools are fantastic, but they're not always the sharpest or most efficient solution.

This article is an invitation to ditch the fancy GUI and the AI assistant—just for a moment. Let's explore the old-fashioned way with three command-line titans that have powered the software industry for decades: awk, sed, and grep.

The Problem with Our Modern Comfort Zone

I love VS Code; it's been my primary editor for most of my career. But relying on it for everything has its costs.

- _The GUI Performance Bottleneck_: Open a truly massive codebase or a gigabyte-sized log file in a GUI editor. You'll feel it—the laggy LSP, the slow search, the seconds that tick by when you're in a high-pressure situation. These tools can buckle under weight.

- _The Editor "Lock-In"_: Mastering VS Code's shortcuts and extensions is great, but that muscle memory doesn't pay dividends outside of that specific application. What happens when you're SSH'd into a barebones server and just need to make a quick, powerful change?

- _The AI Crutch_: LLMs are revolutionary, but they aren't free. Why burn expensive tokens and wait for an API call just to extract a few columns from a file? Save your AI budget for brainstorming architecture, not for tasks you can solve yourself in seconds.

Why Go Back to the Terminal?

So, why bother learning these cryptic old tools? The reasons are as practical today as they were thirty years ago.

- _Blazing Speed_: These utilities are written in C, optimized for one job, and they do it at blistering speeds. They handle massive files without breaking a sweat.

- _Universal Availability_: awk, sed, and grep are installed on virtually every Linux, macOS, and Unix-like system on the planet. The skills you build are universally portable.

- _Unmatched Composability_: The true magic is how they work together. You can grep to find the right lines, awk to extract the right columns, and sed to transform the output, all in a single, elegant chain.

- And Yes, _It's Empowering_: Let's be honest—there's an undeniable satisfaction in crafting a command that solves a complex problem in seconds. It's the mark of a true power user.

## So, fire up your terminal. Let's get our hands dirty and see what these legendary tools can do.

First, let's assume we have two sample files for our examples.

**Sample Log File: `access.log`**

```
192.168.1.5 - - [28/Aug/2025:12:15:01 +0530] "GET /index.html HTTP/1.1" 200 512
10.0.0.2 - - [28/Aug/2025:12:15:03 +0530] "GET /styles/main.css HTTP/1.1" 200 1024
192.168.1.5 - - [28/Aug/2025:12:15:05 +0530] "GET /images/logo.png HTTP/1.1" 200 2048
10.0.0.3 - - [28/Aug/2025:12:16:10 +0530] "POST /api/login HTTP/1.1" 401 128
192.168.1.5 - - [28/Aug/2025:12:16:12 +0530] "GET /does-not-exist.html HTTP/1.1" 404 128
```

**Sample Config File: `config.conf`**

```
# Server Settings
hostname = webapp.dev.local
port = 8080
debug_mode = true
```

---

### `grep`: The Line Finder

`grep` is your go-to tool for searching files and finding lines that contain a specific pattern.

#### Example 1: Find all error lines

- **Scenario:** You need to quickly find all the requests in your log file that resulted in a client-side error (like a `404 Not Found` or `401 Unauthorized`).
- **Command:**
  ```bash
  grep " 40" access.log
  ```
- **Output:**
  ```
  10.0.0.3 - - [28/Aug/2025:12:16:10 +0530] "POST /api/login HTTP/1.1" 401 128
  192.168.1.5 - - [28/Aug/2025:12:16:12 +0530] "GET /does-not-exist.html HTTP/1.1" 404 128
  ```
- **Explanation:** `grep` searches `access.log` for any line containing the string `" 40"`. We use a space before it to avoid accidentally matching something in the timestamp or file size. This effectively finds lines with status codes `401` and `404`.

---

### `sed`: The Stream Editor ✍️

`sed` is used for performing transformations on text, most commonly for finding and replacing strings.

#### Example 1: Update a configuration value

- **Scenario:** You're preparing to deploy an application and need to change the hostname in the config file from the development value to the production value.
- **Command:**
  ```bash
  sed 's/webapp.dev.local/webapp.prod.com/' config.conf
  ```
- **Output:**
  ```
  # Server Settings
  hostname = webapp.prod.com
  port = 8080
  debug_mode = true
  ```
- **Explanation:** The command `s/old/new/` tells `sed` to **s**ubstitute the `old` string with the `new` one. By default, `sed` just prints the result to the terminal without changing the original file, which is great for a safe preview. To save the changes, you would use the `-i` flag (e.g., `sed -i 's/...' config.conf`).

---

### `awk`: The Column Processor

`awk` is a powerful tool that sees text as a series of columns (or fields), making it perfect for extracting data and generating reports.

#### Example 1: Extract specific columns from a log

- **Scenario:** You don't need all the information in the log file. You just want a simple list of the IP addresses and the URLs they requested.
- **Command:**
  ```bash
  awk '{print $1, $7}' access.log
  ```
- **Output:**
  ```
  192.168.1.5 /index.html
  10.0.0.2 /styles/main.css
  192.168.1.5 /images/logo.png
  10.0.0.3 /api/login
  192.168.1.5 /does-not-exist.html
  ```
- **Explanation:** `awk` automatically splits each line into fields based on spaces. `$1` refers to the first field (the IP address) and `$7` refers to the seventh field (the URL). The `print` command simply outputs these two fields.

#### Example 2: Conditional reporting

- **Scenario:** You want to find out which IP addresses are causing "Not Found" errors.
- **Command:**
  ```bash
  awk '$9 == "404" {print "404 Error from IP:", $1}' access.log
  ```
- **Output:**
  ```
  404 Error from IP: 192.168.1.5
  ```
- **Explanation:** This command adds a condition. It checks if the ninth field (`$9`, the status code) is exactly `"404"`. If it is, `awk` then executes the action in the curly braces `{...}`, which is to print a custom string along with the IP address (`$1`).

---

### Putting It All Together

The real power of these tools comes from combining them with the pipe `|` operator.

- **Scenario:** You want to generate a report of the top 3 IP addresses that are making requests to your server.
- **Command:**
  ```bash
  awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -n 3
  ```
- **Output:**
  ```
        3 192.168.1.5
        2 10.0.0.2
        1 10.0.0.3
  ```
- **Explanation (Step-by-Step):**
  1.  `awk '{print $1}' access.log`: Extracts only the IP addresses (the first column).
  2.  `| sort`: Sorts the list of IPs so that identical ones are grouped together.
  3.  `| uniq -c`: Collapses the sorted list, counting (`-c`) the occurrences of each unique (`uniq`) IP.
  4.  `| sort -nr`: Sorts the result numerically (`-n`) and in reverse (`-r`) order to put the highest counts first.
  5.  `| head -n 3`: Shows only the top 3 lines of the final sorted list.

---

This was a short and concise demo to see what can we do using CLI. Needless to say, we have barely scrathed the surface.

In coming days I will focus more on text-processing and automation via CLI as this is my favorite topic to dive into.

Stay tuned and happy coding!

### Further Reading

- [GREP AWK SED by University of York](https://www-users.york.ac.uk/~mijp1/teaching/2nd_year_Comp_Lab/guides/grep_awk_sed.pdf)

- [GNU AWK User Guide](https://www.gnu.org/software/gawk/manual/gawk.html)
