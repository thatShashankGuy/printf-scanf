---
title: Build Custom Browser Extensions with Javascript
author: Shashank Shekhar
date: 2024-09-23
---

![firefox-plugin](/firefox-plugin.png)

In this quick article, we will learn how to build a browser extension to manipulate some website behavior for your personal use.

### What is a Browser Extension?

A browser extension is essentially a small software program that adds custom functionality to your web browser. Extensions can help you take notes, manage passwords, block ads, and more.

They can be installed in most modern browsers like Chrome, Firefox, Edge, etc. Often, an extension can be downloaded and installed from a web store, like the [Chrome Web Store](https://chromewebstore.google.com/category/extensions).

While extensions can provide useful functionality, they also pose security risks since they execute JavaScript on your browser. Therefore, it's a good practice to only install extensions from reputable sources, as recommended by most web browsers.

### Building Our Own Extension

While downloading unknown code can be risky, building your own extension for small utilities is actually very simple! 

In this demonstration, I’ll show you how to build an extension I created that hides the comments section on YouTube.

### Hiding YouTube Comments

For our demonstration, we will use YouTube. When you visit YouTube, the site delivers HTML, CSS, and JavaScript to your browser to display and interact with content.

Our extension will inject custom JavaScript to hide the entire comment section on YouTube. While the code works on all major web browsers, we will use Firefox for this demonstration.

### Creating the Extension

To create a web extension, you need two files:
- `manifest.json`
- `content.js`

The `content.js` file contains the code that will run in the browser, while `manifest.json` is the configuration file that defines the extension’s settings, permissions, name, and description. You can think of `manifest.json` as similar to a `package.json` in a Node.js project.

Here is the code for our extension. You can also find all the demo code for this exercise at [this GitHub repository](https://github.com/thatShashankGuy/code-examples/tree/master/firefox-extension).

```js
// Hide the comments section
const hideComments = () => {
  const commentsSection = document.getElementById('comments');
  if (commentsSection) {
    commentsSection.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', hideComments);

const observer = new MutationObserver(hideComments);
observer.observe(document.body, { childList: true, subtree: true });
```

Let’s break down the `content.js` script:

1. **`hideComments` Function**:
   This function selects the element with the ID `comments` and sets its display style to `none`, effectively hiding the comments section on YouTube. You can verify this by inspecting the YouTube page, where the comments section is wrapped in a `div` with the ID `comments`.

   ![youtub-with-comment](/youtub-with-comment.png)

2. **`MutationObserver`**:
   The `MutationObserver` interface allows you to watch for changes in the DOM (Document Object Model). We use this to ensure that if the DOM changes (e.g., YouTube loads comments dynamically), the `hideComments` function will be called to hide the comment section again.

   - **`hideComments` as a Callback**:
     This function is passed as a callback, which will be executed when mutations (like adding or removing child elements) are detected in the `document.body`.

   - **`observer.observe`**:
     This starts the observer, monitoring the entire body of the HTML page for changes. The options `{ childList: true, subtree: true }` tell the observer to:
     - `childList: true`: Listen for direct changes in the list of child elements within `document.body`.
     - `subtree: true`: Listen for changes throughout the entire DOM tree, not just immediate children.

---

Now, let's take a look at the `manifest.json` file.

```json
{
  "manifest_version": 3,
  "name": "YouTube Comments Hider",
  "version": "1.0",
  "description": "Hides comments section on YouTube.",
  "content_scripts": [
    {
      "matches": ["*://www.youtube.com/*"],
      "js": ["content.js"]
    }
  ],
  "permissions": ["activeTab"]
}
```

Lets discuss "manifest.json" now. 

- **`manifest_version`**: Specifies the version of the manifest format (in this case, version 3).
- **`name`**: The name of the extension, which will appear in the browser’s extension manager.
- **`version`**: The version of the extension. Here, it is set to "1.0".
- **`description`**: A brief description of what the extension does.
- **`content_scripts`**: Defines which scripts will be injected into web pages. Here, the script `content.js` will be injected into any page on YouTube.
  - **`matches`**: Specifies the URLs where the content script should be injected. The `"*://www.youtube.com/*"` pattern means the script will run on all YouTube pages (both HTTP and HTTPS).
  - **`js`**: Lists the JavaScript file(s) to inject.
- **`permissions`**: The `"activeTab"` permission allows the extension to access the content of the active tab temporarily.

### Loading the Extension in Firefox

To load this extension into Firefox, follow these steps:

1. Open Firefox and go to the **about:debugging** page by typing `about:debugging` into the address bar.
   
2. Click on **"This Firefox"** from the left-hand menu.

3. Click **"Load Temporary Add-on"**.

4. Select any file in your extension's directory (e.g., `manifest.json`). Firefox will automatically detect and load the entire extension.

   ![fire-fox-addon](/fire-fox-addon.png)

The extension will now be installed temporarily. It will remain installed until you restart Firefox.

### Testing the Extension

Once installed, go to YouTube, open any video, and navigate to the comments section to see the effects of the extension.

![youtub-without-comment](/youtub-without-comment.png)

### Conclusion

I hope this helps you understand how browser extensions work and how you can create your own. Stay tuned for more posts in the coming weeks. Happy coding!
!

### Futher Readings and References. 
- [Web Extensions - MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

- [Web Extension API and Browser Support](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)

- [Web Extension Security](https://security.berkeley.edu/education-awareness/browser-extensions-how-vet-and-install-safely)