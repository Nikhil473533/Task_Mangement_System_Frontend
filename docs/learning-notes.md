# Angular Learning Notes

## Day 1: Getting Started with Angular 21

### Initial Setup
- Installed Angular 21 locally
- Understood difference between global vs local CLI
- Understood role of npx
- Created standalone Angular project

### How an Angular App Starts

```
main.ts
   ↓
bootstrapApplication()
   ↓
App component (root)
   ↓
RouterOutlet
   ↓
Feature components
```

### Detailed Explanation

#### 1️⃣ index.html is the Starting HTML Page

Inside `src/index.html`, Angular includes:

```html
<app-root></app-root>
```

This is just a placeholder tag.

At this point, nothing dynamic has happened yet. It is plain HTML.

#### 2️⃣ main.ts Starts the Angular Application

**File:** `main.ts`

Angular runs this file first.

It calls:

```typescript
bootstrapApplication(App, appConfig)
```

This does the following:

1. Starts the Angular framework
2. Creates the Dependency Injection container
3. Loads global configuration (routing, providers, etc.)
4. Creates the root component (App)
5. Mounts it into `<app-root>` inside index.html

This is similar to `main()` in a backend application.

#### 3️⃣ The App Component Renders

**File:** `app.ts`

This is the root component of the application.

When Angular bootstraps:

1. It creates an instance of the App component
2. It replaces `<app-root>` in index.html with the App component's template (app.html)
3. The UI is now controlled by Angular
4. The App component is the top of the component tree

#### 4️⃣ RouterOutlet Waits for a Route

Inside the App component template, there is:

```html
<router-outlet></router-outlet>
```

This acts as a placeholder.

It tells Angular:

> "When the URL changes, render the matching component here."

It does not render anything by itself. It waits.

#### 5️⃣ The Router Loads a Matching Component

**File:** `app.routes.ts`

Angular checks the current browser URL.

Then it:

1. Looks at the defined routes
2. Finds a matching path
3. Loads the corresponding component
4. Renders that component inside `<router-outlet>`

This is how navigation works in Angular.

### 🔁 Full Flow Summary

1. Browser loads index.html
2. Angular starts from main.ts
3. Angular bootstraps the App component
4. App replaces `<app-root>`
5. Router waits for URL
6. Matching component is rendered inside `<router-outlet>`

### 🧩 One-Line Summary

Angular starts from `main.ts`, mounts the root component into `<app-root>`, and uses the router to dynamically render components inside `<router-outlet>` based on the URL.

---

## In-Depth Explanation of How the Application Starts

### 1. Starting Page of the Application

`index.html` is the starting HTML page

Inside `src/index.html`, Angular includes:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TaskUi</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

Here the important tag is `<app-root></app-root>`

This is just a placeholder tag.

At this point, nothing dynamic has happened yet. It is plain HTML.

### 2. The Actual Starting Point of the Application

The starting point is `main.ts`. When an Angular application starts, Angular calls the `bootstrapApplication` function first. It is like the `main` method in Java.

This is the code in the `main.ts` file:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

As we can see, there is only one method in this file: `bootstrapApplication`, and it takes two arguments:
- The first is the App component class
- The second is the appConfig object from the `app.config` file

This function is a replacement for this older function:

```typescript
platformBrowserDynamic().bootstrapModule(AppModule)
```

**This does the following:**

1. Starts the Angular framework
2. Creates the Dependency Injection container
3. Loads global configuration (routing, providers, etc.)
4. Creates the root component (App)
5. Mounts it into `<app-root>` inside index.html

### 3. The App Component Renders

**File:** `app.ts`

Code in the `app.ts` file:

```typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('task-ui');
}
```

This is the root component of the application.

When Angular bootstraps:

1. It creates an instance of the App component
2. It replaces `<app-root>` in index.html with the App component's template (app.html)
3. The UI is now controlled by Angular
4. The App component is the top of the component tree

Steps 4 and 5 are already explained in the sections above.

---

## Day 2: Understanding Signals

### What is a Signal?

A signal is a reactive state container in Angular.

It:

- Stores a value
- Notifies Angular when the value changes
- Automatically triggers component re-rendering

### Creating a Signal

```typescript
const count = signal(0);
```

### Reading a Signal

```typescript
count()
```

### Updating a Signal

```typescript
count.set(5);
count.update(v => v + 1);
```

Signals simplify state management compared to RxJS for local component state.

### What Is It Technically?

Internally, a signal:

- Tracks who reads it
- Registers dependencies
- Re-runs template rendering when value changes

It is part of Angular's fine-grained reactivity system.

This reduces unnecessary re-rendering.

### Using Signals in HTML Templates

In template:

```html
{{ title() }}
```

**Not:**

```html
{{ title }}
```

Because signals are functions.

### Important Note

**Signals are best for:**

1. Local component state
2. UI state
3. Simple reactive values

**For these, still use RxJS:**

1. HTTP streams
2. Async events
3. Complex flows