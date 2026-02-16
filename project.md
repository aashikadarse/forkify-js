# **SCSS**

---

## **SCSS stands for Sassy CSS**

It’s a **CSS pre-processor**.

That means:

You don’t write regular CSS in SCSS files.
Instead, you write SCSS, and a build tool (like Parcel) converts it into normal CSS that browsers understand.

Browsers cannot read SCSS directly.

```
SCSS → compiled → CSS → browser
```

---

# **WHY USE SCSS INSTEAD OF CSS?**

SCSS adds features that make writing CSS easier, cleaner, and more maintainable:

SCSS lets you use:

- **Variables**
- **Nesting**
- **Mixins**
- **Functions**
- **Partials**
- **Operators**

Regular CSS has no built-in support for these (before CSS custom properties).

SCSS makes large projects easier to style.

---

# **CORE SCSS FEATURES (with examples)**

Here are the concepts

---

## **A) VARIABLES ($)**

SCSS variables start with `$`.

### **WHY use variables?**

So you define a value once and reuse it everywhere.

Example:

```scss
$color-primary: #f38e82;
```

Later:

```scss
body {
  color: $color-primary;
}
```

If you want to change the main color:
You change one line — not hundreds of selectors.

---

## **B) NESTING (&)**

`&` is the **parent selector reference**.

It lets you write nested rules that compile into regular CSS.

### Example without `&`

```css
.button {
  background: blue;
}

.button:hover {
  background: darkblue;
}
```

### With nesting + `&`

```scss
.button {
  background: blue;

  &:hover {
    background: darkblue;
  }
}
```

This says:
**“Inside .button, when hovered...”**

It saves repetition and groups related styles clearly.

---

## **C) PARTIALS AND IMPORTS (\_underscore prefix)**

Files that start with `_` are called **partials**.

Example:

```
_something.scss
```

Because of `_`, SCSS compiler knows:
**“This file is not compiled to CSS on its own.”**

Instead, it gets included into main.scss using:

```scss
@import "something";
```

This keeps styles modular.

---

## **Your project has**

```
_base.scss
_component.scss
_header.scss
_searchResults.scss
_preview.scss
_upload.scss
_recipe.scss
main.scss
```

Each partial contains only related styles (buttons, layout, recipe panel, search panel).

Once combined, main.scss becomes one CSS file.

This avoids one giant CSS file that is hard to manage.

---

# **HOW SCSS FEATURES ARE USED IN FORKIFY**

---

## **● $variable**

Used for:

- colors
- font sizes
- spacing
- layout breakpoints

It helps keep consistent design.

Example in SCSS (pseudo, not exact code):

```scss
$color-grey-light: #f7f7f7;
$font-primary: "Nunito Sans", sans-serif;
```

Used everywhere:

```scss
body {
  font: $font-primary;
  background: $color-grey-light;
}
```

If design changes → change only one variable.

---

## **● &:hover, &--modifier**

Let’s say SCSS contains:

```scss
.button {
  &--small {
    font-size: 1.2rem;
  }
  &:hover {
    background: $color-primary-light;
  }
}
```

Meaning:

```
.button--small
.button:hover
```

`&` refers to current parent selector.

This improves organization.

Instead of writing:

```css
.button--small {
  ...;
}
.button:hover {
  ...;
}
```

You nest under one button rule.

---

## **● \_partial.scss files**

Each underscore file is a style part.

For example:

```
_header.scss
→ Contains only header styles

_recipe.scss
→ Contains recipe panel UI
```

These files are imported into main.scss:

```scss
@import "base";
@import "header";
```

This results in:

**Compiled CSS = all partials merged into one**

---

# **WHEN SCSS IS COMPILED?**

Build tool (Parcel) watches SCSS:

You write SCSS in:

```
src/sass/*.scss
```

Parcel compiles into CSS.

Browser loads CSS via:

```html
<link rel="stylesheet" href="main.scss" />
```

Behind the scenes:
Parcel converts **SCSS → CSS**

---

# **CONFIG.JS**

---

## **config.js is a central settings file**

It stores values that control how the app behaves.

These values are:

- reused in multiple places
- not supposed to change often
- better kept outside logic code

Think of config.js like:

**“Control panel of constants for the app”**

Instead of hardcoding values inside functions, you import them from it.

---

## **Constants**

```js
export const API_URL = "https://forkify-api.jonas.io/api/v2/recipes/";
```

Base URL of the Forkify API.

```js
fetch(`${API_URL}${id}`);
```

If API changes → edit once → entire app updates.

---

```js
export const TIMEOUT_SEC = 10;
```

Maximum number of seconds to wait for API response.

Network calls can hang forever. You must fail safely.

---

```js
export const RES_PER_PAGE = 10;
```

How many search results show per page.

---

```js
export const KEY = "5cadbeef-ac56-4b91-9192-bbec25e4230a";
```

Forkify API requires a key for:

- uploading recipes
- accessing user-created recipes
- protected endpoints

---

```js
export const MODAL_CLOSE_SEC = 2.5;
```

Delay before upload modal closes after success.

Used in controller.js:

- show success message
- wait 2.5 sec
- close modal

---

# **HELPER.JS**

---

This file is a **network utility layer**.

helper.js stores reusable support functions.

In this project it mainly stores:

- API request logic
- timeout logic
- reusable network helpers

Purpose:
**Handle all API requests in one reusable place.**

---

## **regenerator-runtime**

```js
import { async } from "regenerator-runtime";
```

Some older browsers don’t support async/await directly after bundling.

Parcel uses regenerator-runtime so async functions still work after build.

---

## **Import timeout config**

```js
import { TIMEOUT_SEC } from "./config.js";
```

This imports a constant value:
How many seconds before request should timeout.

---

# **PROMISES**

Promises represent the completion or failure of an asynchronous operation.

A promise can be in one of three states:

- pending → waiting
- fulfilled → success
- rejected → failed

---

## **Basic syntax**

```js
const p = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve("Done");
  }, 2000);
});
p.then((data) => console.log(data));
```

---

## **With condition**

```js
const p = new Promise(function (resolve, reject) {
  setTimeout(function () {
    const success = true;

    if (success) {
      resolve("Done");
    } else {
      reject("Something failed");
    }
  }, 2000);
});
```

resolve() → success
reject() → failure

---

# **Timeout Promise**

```js
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
```

Parameters are normally:

```
(resolve, reject)
```

But here we write:

```
(_, reject)
```

Because we don’t need resolve.
This Promise will only fail (timeout).

setTimeout expects milliseconds.

But config uses seconds.

**Conversion:**

```
1 second = 1000 milliseconds
```

A Promise that automatically fails after X seconds.

---

# **AJAX FUNCTION**

```js
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
```

---

## **AJAX Meaning**

AJAX = **Asynchronous Javascript And XML**

A web development technique used to create dynamic web pages that communicate with a server in the background without requiring a full page reload.

Most popular data format: **JSON**

---

## **async means**

Function automatically returns a Promise.

---

## **Parameters**

url → API endpoint
uploadData → data to send (optional)

If uploadData exists → POST request
If not → GET request

---

## **Error Handling**

```js
try { risky async code }
catch(err) { handle error }
```

Network calls can fail → try/catch prevents crash.

Error is re-thrown so controller/model can show UI error.

---

## **Ternary Fetch Logic**

```js
const fetchPro = uploadData
  ? fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadData),
    })
  : fetch(url);
```

This is a ternary operator (if/else shortcut).

---

### **If uploadData exists → POST**

- method POST
- header tells server JSON coming
- body sends JSON string

JSON.stringify converts JS object → JSON text.

Server understands JSON, not JS objects.

---

### **If uploadData not exists → GET**

```
fetch(url)
```

Returns a Promise → Response object.

---

## **Promise.race**

```js
const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
```

Two promises compete:

- fetch request
- timeout promise

Whichever finishes first wins.

If server too slow → timeout rejects → stops waiting.

Prevents hanging requests.

---

## **Re-throw error**

```js
catch(err){
  throw err;
}
```

Why not handle here?
Because helper.js should not decide UI behavior.

Controller handles display.

---

# **MODEL.JS**

---

## **Imports**

```js
import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helper.js";
```

Meaning:

- regenerator-runtime → async/await support after bundling
- config.js → constants
- helper.js → AJAX logic

Model should not hardcode URLs or fetch logic.

---

# **Global State Object — App Memory**

```js
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
```

This is the **single source of truth** for your app.

Stores:

- current recipe
- search results
- current page
- bookmarks

Controller reads from this.
Views render from this.

Think: **app database in memory.**

---

# **createRecipeObject**

```js
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return (state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cooking_time: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  });
};
```

Why needed?

API data is messy and nested.
You reshape into clean format.

---

## **Conditional Spread Trick**

```
...(recipe.key && { key: recipe.key })
```

Meaning:

- checks if key exists
- if true → add it
- if false → add nothing

---

# **loadRecipe**

```js
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}!!`);
    throw err;
  }
};
```

Flow:

fetch → server → JSON → AJAX → data → await receives.

Only job:
Check if recipe already bookmarked.

---

# **loadSearchResults**

```js
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.log(`${err}`);
  }
};
```

---

## **Why store query**

```
state.search.query = query;
```

Used later for:

- pagination
- UI refresh
- controller reuse

---

## **Query URL**

```
?search=query
&key=APIKEY
```

search → what to find
key → authorization

---

## **Why map()**

API object is heavy — UI needs only few fields:

- id
- title
- publisher
- image
- key

map() returns cleaned objects.

---

## **Rename image_url → image**

For consistent naming across app.

---

## **Reset Page**

```
state.search.page = 1;
```

New search → start from page 1.

---

# **Full Flow Summary**

User types → search submit
→ controller calls loadSearchResults(query)
→ API called
→ results cleaned using map
→ stored in state.search.results
→ page reset
→ controller renders results view

---

```js
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};
```

This function returns only one page of search results from the full results array.

Instead of showing all results at once, we show:

Page 1 → first 10 items

Page 2 → next 10 items

Page 3 → next 10 items

This is called pagination.

# Main Purpose of This Function

This function implements **pagination logic**.

It returns only the results that belong to a specific page instead of returning the entire results array.

**Flow:**

```
Big results array → split → page-sized chunks → return one chunk
```

---

## Example Scenario

- Total search results = 50
- Results per page = 10

| Page   | Items Returned |
| ------ | -------------- |
| Page 1 | First 10       |
| Page 2 | Next 10        |
| Page 3 | Next 10        |

---

# State Structure Used

```js
state.search = {
  query: "pizza",
  results: [...],
  page: 1,
  resultsPerPage: 10
};
```

### Meaning

- `results` → full search results array
- `resultsPerPage` → items per page
- `page` → current active page

---

## Line 1 — Function + Default Parameter

```js
function (page = state.search.page)
```

### What it does

Defines a parameter with a **default value**.

If no page number is passed → it uses:

```js
state.search.page;
```

### Example A — Page Provided

```js
getSearchResultsPage(3);
```

Result:

```
page = 3
```

### Example B — Page Not Provided

```js
getSearchResultsPage();
```

Result:

```
page = state.search.page
```

### Why This Is Smart

- Allows optional input
- Prevents undefined errors
- Makes function reusable

---

## Line 2 — Update Global State

```js
state.search.page = page;
```

Even though `page` already exists, we assign it again to:

**Update global app state**

### Why this matters

Other modules rely on it:

- Pagination buttons
- UI highlight
- Next/Previous navigation
- Controller logic

### Example

User clicks page 4:

```js
getSearchResultsPage(4);
```

Now global state becomes:

```js
state.search.page = 4;
```

Whole app knows active page = 4

---

## Line 3 — Start Index

```js
const start = (page - 1) * state.search.resultsPerPage;
```

### Why `(page - 1)`?

Because:

- Pages start at **1**
- Arrays start at **0**

We shift numbering to match array indexing.

### Example (`resultsPerPage = 10`)

| Page | Calculation | Start |
| ---- | ----------- | ----- |
| 1    | (1−1)\*10   | 0     |
| 2    | (2−1)\*10   | 10    |
| 3    | (3−1)\*10   | 20    |

---

## Line 4 — End Index

```js
const end = page * state.search.resultsPerPage;
```

### Example (`resultsPerPage = 10`)

| Page | Calculation | End |
| ---- | ----------- | --- |
| 1    | 1\*10       | 10  |
| 2    | 2\*10       | 20  |
| 3    | 3\*10       | 30  |

---

# Array Slicing Logic

## Line 5 — Slice Results

```js
return state.search.results.slice(start, end);
```

### Slice Rule

```
slice(start, end)
includes start
excludes end
```

Example:

```js
slice(0, 10);
```

Returns indexes:

```
0 → 9  (10 items)
```

---

# Full Working Example

## Data

```js
results = [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O];

resultsPerPage = 5;
```

Indexes:

```
0 A
1 B
2 C
3 D
4 E
5 F
6 G
7 H
8 I
9 J
10 K
11 L
12 M
13 N
14 O
```

---

## Page 1

```
page = 1
start = (1−1)*5 = 0
end = 1*5 = 5
slice(0,5)
```

**Return**

```
A B C D E
```

---

# Why Both Default Parameter AND State Assignment Exist

They solve **two different problems**.

---

## Default Parameter

```js
page = state.search.page;
```

Used when function is called without argument.

Provides fallback value.

---

## State Assignment

```js
state.search.page = page;
```

Used to update global state.

Lets the app remember current page.

---

## Together They Provide

- Flexible input handling
- Correct state tracking
- Reusable function
- Stable pagination behavior

---

# Final Formula to Remember

```
start = (page − 1) × perPage
end   = page × perPage
return array.slice(start, end)
```

---

## UpdateServings

```js
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt=oldQt*newSevings/oldServings//
  });

  state.recipe.servings = newServings;
};
```

# Main Purpose of This Function

This function updates **ingredient quantities automatically** when the user changes the number of servings.

Instead of keeping ingredient amounts fixed, it **rescales them proportionally**.

Think of it as:

```
Change servings → auto adjust ingredient quantities → keep recipe ratios correct
```

---

# State Structure Used

```js
state.recipe = {
  servings: 4,
  ingredients: [
    { quantity: 200, unit: "g", description: "flour" },
    { quantity: 2, unit: "", description: "eggs" },
  ],
};
```

### Meaning

- `servings` → current serving count
- `ingredients` → array of ingredient objects
- `quantity` → numeric amount for each ingredient

---

## Line 1 — Function Definition

```js
function (newServings)
```

The function receives the **new serving size** chosen by the user.

Example:

```js
updateServings(8);
```

User changed servings from 4 → 8.

---

## Line 2 — Loop Through Ingredients

```js
state.recipe.ingredients.forEach(ing => {
```

We loop through every ingredient in the recipe.

Why?

Because every ingredient quantity must be recalculated.

---

## Line 3 — Quantity Recalculation Formula

```js
ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
```

This is the core scaling formula.

```
newQuantity = oldQuantity × newServings ÷ oldServings
```

It preserves the ingredient ratio.

---

# Why This Formula Works

Suppose:

```
Old servings = 4
New servings = 8
Flour = 200 g
```

Calculation:

```
newQt = 200 × 8 / 4
newQt = 400 g
```

Exactly doubled — correct behavior.

---

# Example Walkthrough

## Before Update

```js
servings = 4

ingredients:
flour = 200g
milk = 500ml
eggs = 2
```

---

## Call Function

```js
updateServings(2);
```

---

## Calculations

| Ingredient | Old | Formula | New |
| ---------- | --- | ------- | --- |
| flour      | 200 | 200×2/4 | 100 |
| milk       | 500 | 500×2/4 | 250 |
| eggs       | 2   | 2×2/4   | 1   |

---

## After Update

```js
servings = 2

ingredients:
flour = 100g
milk = 250ml
eggs = 1
```

---

# ⚠️ Important Detail — Order Matters

Notice this line comes **after** the loop:

```js
state.recipe.servings = newServings;
```

This is intentional.

### Why?

The formula needs the **old servings value** during calculation.

If you updated servings first, the math would break.

Correct order:

```
1️ Use old servings in formula
2️ Update servings after recalculation
```

---

## Formula to Remember

```
newQuantity = oldQuantity × newServings ÷ oldServings
```

Whenever servings change → quantities must scale → ratios must stay intact.

# `persistBookmarks`

## Function Code

```js
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};
```

---

# Main Purpose of This Function

This function saves the current bookmarks data into the browser’s **localStorage** so that bookmarks remain available even after:

- Page refresh
- Browser restart
- Tab close & reopen

In short:

```
state.bookmarks → convert to string → store in browser storage
```

---

# State Structure Used

```js
state.bookmarks = [
  { id: "123", title: "Pizza", publisher: "ABC Kitchen" },
  { id: "456", title: "Pasta", publisher: "Italian Chef" },
];
```

This is a normal JavaScript array of objects.

But localStorage cannot store objects directly — only strings.

---

## Function Definition

```js
const persistBookmarks = function () {
```

Defines a helper function.

Usually this is called whenever:

- User adds a bookmark
- User removes a bookmark
- Bookmark list changes

So storage stays in sync with state.

---

## localStorage.setItem

```js
localStorage.setItem('bookmarks', ...)
```

### What it does

Stores data inside the browser’s storage.

It uses:

```
setItem(key, value)
```

Here:

- key = `"bookmarks"`
- value = stored data string

Think of it like:

```
localStorage["bookmarks"] = "some string data"
```

---

## JSON.stringify

```js
JSON.stringify(state.bookmarks);
```

### Why needed

localStorage only accepts **strings**.

But `state.bookmarks` is an object/array.

So we convert it:

```
JS Object → JSON string
```

### Example

```js
[{ id: 1, title: "Pizza" }];
```

becomes:

```json
"[{\"id\":1,\"title\":\"Pizza\"}]"
```

Now it can be stored safely.

---

# What Actually Gets Stored

After calling:

```js
persistBookmarks();
```

Browser storage contains:

```
Key: "bookmarks"
Value: "[{...},{...}]"
```

---

# How It’s Read Back Later

When app loads, you usually restore it like this:

```js
const storage = localStorage.getItem("bookmarks");
if (storage) state.bookmarks = JSON.parse(storage);
```

Reverse process:

```
Stored string → JSON.parse → JS object again
```

---

# ⚠️ Common Mistake to Avoid

Storing without stringify:

```js
localStorage.setItem("bookmarks", state.bookmarks);
```

This stores:

```
[object Object]
```

Which is useless.

Always stringify structured data.

---

# Key Takeaway

This function gives your app **memory across reloads**.

## Formula to Remember

```
Save → JSON.stringify → localStorage.setItem
Load → localStorage.getItem → JSON.parse
```

Simple function — but critical for real app behavior.

# Bookmark System — `addBookmark` and `deleteBookmark`

## Function Code

```js
export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);

  state.bookmarks.splice(index, 1);

  // mark current recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};
```

---

# Overview

These two functions manage the bookmark feature in your app.

They handle four responsibilities:

1. Adding a recipe to bookmarks
2. Removing a recipe from bookmarks
3. Updating the currently open recipe’s bookmark flag
4. Saving bookmarks to localStorage

They keep data state, UI state, and browser storage in sync.

---

# State Structure Used

```js
state = {
  recipe: {
    id: "b2",
    title: "Pasta",
    bookmarked: false,
  },
  bookmarks: [],
};
```

- `state.bookmarks` → array of saved recipes
- `state.recipe` → recipe currently shown on screen
- `bookmarked` → controls bookmark icon in UI

---

# addBookmark Function — Line by Line

## Line — Function Parameter

```js
function(recipe)
```

The function receives the full recipe object to be bookmarked.

Example call:

```js
addBookmark(currentRecipe);
```

---

## Line — Push into Bookmarks Array

```js
state.bookmarks.push(recipe);
```

Adds the recipe to the bookmarks list.

Example:

Before:

```js
[];
```

After:

```js
[{ id: "b2", title: "Pasta" }];
```

---

## Line — Update Current Recipe Bookmark Flag

```js
if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
```

This checks whether the bookmarked recipe is the one currently open.

If yes, update its flag so UI can react immediately.

Example:

```
recipe.id = "b2"
state.recipe.id = "b2"
```

Condition is true → set:

```js
bookmarked = true;
```

This updates the bookmark icon without reloading.

---

## Line — Persist Bookmarks

```js
persistBookmarks();
```

Saves bookmarks to localStorage.

Without this, bookmarks would disappear on page refresh.

---

# deleteBookmark Function — Line by Line

## Line — Function Parameter

```js
function(id)
```

Receives the id of the recipe to remove.

Example:

```js
deleteBookmark("b2");
```

---

## Line — Find Index with findIndex

```js
const index = state.bookmarks.findIndex((el) => el.id === id);
```

Purpose: find the array position of the bookmark to delete.

### How findIndex Works

It checks each element in the array and returns the index of the first match.

Arrow function:

```js
(el) => el.id === id;
```

Means:

For each element (`el`), compare its id with the given id.

Example array:

```js
[{ id: "a1" }, { id: "b2" }, { id: "c3" }];
```

Search id = "b2"

Checks:

```
a1 === b2 → false
b2 === b2 → true → stop
```

Result:

```js
index = 1;
```

---

## Line — Remove Using splice

```js
state.bookmarks.splice(index, 1);
```

splice removes items from an array.

Syntax:

```
splice(startIndex, count)
```

Here:

```
splice(1, 1)
```

Removes one item at index 1.

Before:

```js
[a1, b2, c3];
```

After:

```js
[a1, c3];
```

---

## Line — Update Current Recipe Flag

```js
if (id === state.recipe.id) state.recipe.bookmarked = false;
```

Checks whether the deleted bookmark is the recipe currently open.

If yes → mark it as not bookmarked.

Example:

```
id = "b2"
state.recipe.id = "b2"
```

Condition true → set:

```js
bookmarked = false;
```

This prevents UI from showing an incorrect bookmarked state.

---

## Line — Persist Again

```js
persistBookmarks();
```

Saves updated bookmark list to localStorage after deletion.

Ensures removal is permanent across refresh.

---

# Why Both Functions Update `state.recipe.bookmarked`

Bookmarks array and current recipe object are separate pieces of state.

Updating only the array is not enough for UI correctness.

These lines ensure:

- Bookmark list is correct
- Current recipe display is correct
- Bookmark icon updates instantly

---

# Full Flow Summary

## Add Bookmark

```
User clicks bookmark
→ recipe pushed into bookmarks array
→ current recipe flagged bookmarked = true
→ bookmarks saved to localStorage
```

## Delete Bookmark

```
User removes bookmark
→ index found using findIndex
→ removed using splice
→ current recipe flagged bookmarked = false (if open)
→ bookmarks saved to localStorage
```

This is clean state management: array update + UI flag update + storage sync.

# LocalStorage Init and Clear — Full Code Explanation

## Function Code

```js
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

clearBookmarks();
```

---

# Purpose of This Section

This part of your code handles:

1. Loading bookmarks from localStorage when the app starts
2. Restoring them into app state
3. Clearing stored data (for reset/testing)

This is the bridge between **saved browser data** and **runtime app state**.

---

# init Function — Line by Line

## Line — Function Definition

```js
const init = function(){
```

Defines an initialization function.

This is usually called once when the app loads.

Goal: restore saved bookmarks into memory.

---

## Line — Read From localStorage

```js
const storage = localStorage.getItem("bookmarks");
```

Reads stored value using key `"bookmarks"`.

Important facts:

- localStorage stores only strings
- If nothing stored → returns `null`

Example stored value:

```json
"[{\"id\":\"a1\",\"title\":\"Pizza\"}]"
```

So now:

```js
storage = '[{"id":"a1","title":"Pizza"}]';
```

---

## Line — Conditional Check

```js
if (storage)
```

Means:

Run next line only if something exists in storage.

Why needed:

If storage is null and you try JSON.parse → error risk.

This prevents crashes.

---

## Line — Convert Back to Object

```js
state.bookmarks = JSON.parse(storage);
```

Converts stored JSON string back into JavaScript array.

Process:

```
Stored string → JSON.parse → real JS array/object
```

Example:

Before parse:

```js
"[{id:'a1'}]";
```

After parse:

```js
[{ id: "a1" }];
```

Now your app state has restored bookmarks.

---

# init() Call

```js
init();
```

This runs the initialization immediately when file loads.

Effect:

```
App starts → init runs → bookmarks restored into state
```

Without calling this, saved bookmarks would never load.

---

# Debug Line (Commented)

```js
// console.log(state.bookmarks);
```

Used for testing to confirm bookmarks were restored correctly.

Safe to keep commented in production.

---

# clearBookmarks Function — Line by Line

## Function Definition

```js
const clearBookmarks = function(){
```

Defines a helper function to clear storage.

Usually used only during development/testing.

---

## Line — localStorage.clear

```js
localStorage.clear("bookmarks");
```

Important correction:

`clear()` does NOT take a key.

It removes **everything in localStorage**, not just bookmarks.

Correct ways:

### Remove only bookmarks key

```js
localStorage.removeItem("bookmarks");
```

### Clear entire storage

```js
localStorage.clear();
```

Your current code will still clear all storage — the argument is ignored.

---

# clearBookmarks() Call

```js
clearBookmarks();
```

This runs immediately and wipes storage.

If you keep this call active, your bookmarks will never persist.

Use only when testing reset behavior.

---

# Correct Production Version

```js
const clearBookmarks = function () {
  localStorage.removeItem("bookmarks");
};
```

Call only when you truly want to reset saved bookmarks.

---

# Full Lifecycle Together

## Save

```
add/delete bookmark
→ persistBookmarks()
→ localStorage updated
```

## Load

```
app start
→ init()
→ read localStorage
→ JSON.parse
→ restore into state
```

## Reset (optional)

```
clearBookmarks()
→ remove stored data
```

---

# Key Rules to Remember

- localStorage stores only strings
- Use JSON.stringify when saving
- Use JSON.parse when loading
- Use getItem / setItem for keys
- Use removeItem for one key
- clear() wipes everything

This init pattern is standard in real applications and worth mastering.

# uploadRecipe Function — Full Line-by-Line Explanation

## Function Code

```js
export const uploadRecipe = async function (newRecipe) {
  try {
    // converts an object into an array of [key, value] pairs
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim);

        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! please use the correct format"
          );

        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
```

---

# Purpose of This Function

This function takes recipe data entered by the user from a form and:

1. Extracts ingredient fields
2. Converts them into structured objects
3. Builds a recipe object in API format
4. Sends it to the API
5. Stores the returned recipe in state
6. Automatically bookmarks it

This is your full “upload recipe” pipeline.

---

# Input Example — newRecipe Object

This is what typically comes from your form:

```js
newRecipe = {
  title: "My Pasta",
  sourceUrl: "http://example.com",
  image: "http://img.com/pasta.jpg",
  publisher: "Aashika",
  cookingTime: "30",
  servings: "4",

  ingredient1: "100, g, flour",
  ingredient2: "2, pcs, eggs",
  ingredient3: "",
};
```

Notice ingredients are separate fields and stored as strings.

---

# Step 1 — Async + Try Block

```js
export const uploadRecipe = async function(newRecipe){
  try {
```

- Function is async because it will call an API
- try/catch handles validation or network errors

---

# Step 2 — Object.entries

```js
Object.entries(newRecipe);
```

Converts object → array of `[key, value]`

Example output:

```js
[
  ["title", "My Pasta"],
  ["ingredient1", "100, g, flour"],
  ["ingredient2", "2, pcs, eggs"],
];
```

This makes it easier to filter and transform.

---

# Step 3 — Filter Only Ingredient Fields

```js
.filter(entry =>
  entry[0].startsWith('ingredient') &&
  entry[1] !== ''
)
```

Meaning:

Keep only entries where:

- key starts with "ingredient"
- value is not empty

Example kept:

```
ingredient1 → kept
ingredient2 → kept
ingredient3 → removed (empty)
title → removed
```

---

# Step 4 — Map Each Ingredient

```js
.map(ing => {
```

Now we transform each ingredient string into an object.

Example ing:

```js
["ingredient1", "100, g, flour"];
```

---

# Step 5 — Split Ingredient String

```js
const ingArr = ing[1].split(",").map((el) => el.trim);
```

Split by commas:

```
"100, g, flour"
→ ["100", " g", " flour"]
```

Trim removes spaces:

```
["100","g","flour"]
```

Important correction: it should be `el.trim()` — with parentheses — to actually run.

---

# Step 6 — Validate Format

```js
if (ingArr.length !== 3)
  throw new Error(...)
```

Each ingredient must have exactly:

```
quantity, unit, description
```

If user types wrong format → error thrown → caught by catch block.

---

# Step 7 — Destructuring

```js
const [quantity, unit, description] = ingArr;
```

This assigns:

```
quantity = "100"
unit = "g"
description = "flour"
```

---

# Step 8 — Return Ingredient Object

```js
return {
  quantity: quantity ? +quantity : null,
  unit,
  description,
};
```

Details:

- `+quantity` converts string → number
- If empty → null

Result:

```js
{
  quantity: 100,
  unit: "g",
  description: "flour"
}
```

Now ingredients becomes an array of objects.

---

# Step 9 — Build API Recipe Object

```js
const recipe = {
  title: newRecipe.title,
  source_url: newRecipe.sourceUrl,
  image_url: newRecipe.image,
  publisher: newRecipe.publisher,
  cooking_time: +newRecipe.cookingTime,
  servings: +newRecipe.servings,
  ingredients,
};
```

This reshapes form data to API field names.

Also converts numbers:

```
+"30" → 30
```

---

# Step 10 — Send to API

```js
const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
```

Sends POST request with recipe data.

Waits for server response.

---

# Step 11 — Store in State

```js
state.recipe = createRecipeObject(data);
```

Converts API response → your internal recipe format.

Stores as current recipe.

---

# Step 12 — Auto Bookmark

```js
addBookmark(state.recipe);
```

Newly uploaded recipe is automatically bookmarked.

This improves UX — user doesn’t lose it.

---

# Step 13 — Error Handling

```js
catch(err) {
  throw err;
}
```

If:

- ingredient format wrong
- API fails
- network error

Error is re-thrown so controller can show message.

trim():

Without parentheses, trim never runs and your ingredients will break.

---

# Flow Summary

```
Form data
→ extract ingredient fields
→ split + validate
→ build ingredient objects
→ build recipe object
→ send to API
→ store in state
→ bookmark it
```

---

---

## **VIEW .JS**

This file defines a base View class used by other views (RecipeView, ResultsView, BookmarksView, etc.).
It centralizes common UI rendering logic so you don’t repeat code.

```js
// Import SVG icons file URL (Parcel converts file path → usable URL string)
import icons from "url:../../img/icons.svg";

// Export a base View class that other views (RecipeView, ResultsView, etc.) will extend
export default class View {
  // Class field to store the data passed to render()
  _data;

  // Main render method → takes data and displays it in the UI
  render(data, render = true) {
    // If no data OR empty array → show error UI instead of rendering
    // Array.isArray(data) checks if data is an array
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // Save incoming data into class so other methods can use it
    this._data = data;

    // Call child class method to generate HTML markup string
    // (each child view defines its own _generateMarkup())
    const markup = this._generateMarkup();

    // If render flag is false → just return markup string, don’t insert into DOM
    if (!render) return markup;

    // Remove existing HTML inside parent container before inserting new
    this._clear();

    // Insert generated markup into parent element at the beginning
    // _parentElement is defined in child classes (not here)
    // 'afterbegin' = inside container at the top
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
```

# What This Block Does — In One Look

- imports icon file URL for later SVG usage
- defines reusable base View class
- `_data` stores whatever you render
- `render()` validates data
- prevents rendering empty results
- calls `_generateMarkup()` from child view
- optionally returns markup string only
- clears old HTML
- inserts new HTML into the UI container

# `update(data)`

```js
update(data) {
  this._data = data;

  const newMarkup = this._generateMarkup();

  const newDOM = document
    .createRange()
    .createContextualFragment(newMarkup);

  const newElements = Array.from(newDOM.querySelectorAll('*'));
  const curElements = Array.from(this._parentElement.querySelectorAll('*'));

  newElements.forEach((newEl, i) => {
    const curEl = curElements[i];

    if (
      !newEl.isEqualNode(curEl) &&
      newEl.firstChild?.nodeValue.trim() !== ''
    ) {
      curEl.textContent = newEl.textContent;
    }

    if (!newEl.isEqualNode(curEl))
      Array.from(newEl.attributes).forEach(attr =>
        curEl.setAttribute(attr.name, attr.value)
      );
  });
}
```

---

# What This Function Is For

`update()` updates the UI **without re-rendering the entire HTML**.

It compares:

- new markup (fresh data)
- current markup (already on page)

Then it updates **only the changed text and attributes**.

This is faster and prevents UI flicker.

---

# Big Picture Flow

```
new data comes
→ build new markup (string)
→ convert string to temporary DOM
→ compare temp DOM with current DOM
→ update only differences
```

---

# Step 1 — Store Latest Data

```js
this._data = data;
```

The view stores the newest data so `_generateMarkup()` can build updated HTML.

Example:

```
servings changed from 4 → 6
```

---

# Step 2 — Generate New Markup String

```js
const newMarkup = this._generateMarkup();
```

This creates HTML as a string based on updated data.

Example result:

```html
<span class="recipe__info-data">6</span>
```

Important: this is still just a **string**, not real DOM.

---

# Step 3 — Convert String → DOM Fragment

```js
document.createRange().createContextualFragment(newMarkup);
```

This turns the HTML string into a **temporary DOM tree in memory**.

It is NOT added to the page.

Think of it like:

```
practice DOM copy for comparison
```

---

# Step 4 — Get All Elements from New DOM

```js
const newElements = Array.from(newDOM.querySelectorAll("*"));
```

Selects every element inside the temporary DOM.

Example result:

```
[div, span, svg, button, use, ...]
```

`Array.from` converts NodeList → Array so we can loop.

---

# Step 5 — Get All Current Page Elements

```js
const curElements = Array.from(this._parentElement.querySelectorAll("*"));
```

Gets every element currently rendered on the page inside the parent container.

Now we have:

```
newElements → updated version
curElements → current version
```

Both lists are in the same order.

---

# Step 6 — Compare Elements One by One

```js
newElements.forEach((newEl, i) => {
  const curEl = curElements[i];
```

Each new element is compared with the current element at the same index.

Example:

```
new span[5]  vs  current span[5]
```

---

# Step 7 — Check If Nodes Are Different

```js
newEl.isEqualNode(curEl);
```

Returns true if both nodes are identical:

- same tag
- same text
- same attributes

Example:

```
<span>4</span>
<span>6</span>
```

Result → false (text differs)

---

# Step 8 — Update Text Content Only When Needed

```js
if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
  curEl.textContent = newEl.textContent;
}
```

Conditions:

1. Elements are different
2. New element has text
3. Text is not empty

Then update only the text.

Example:

Before:

```html
<span>4</span>
```

After update:

```html
<span>6</span>
```

Only the number changes — element stays.

---

# Why Optional Chaining Is Used

```js
newEl.firstChild?.nodeValue;
```

Some elements have no text node.

Without `?.`:

```
null.nodeValue → error
```

With `?.`:

```
safely skipped
```

---

# Step 9 — Update Attributes If Changed

```js
Array.from(newEl.attributes).forEach((attr) =>
  curEl.setAttribute(attr.name, attr.value)
);
```

If element differs, copy all attributes from new → current.

Example change:

Before:

```html
<button class="btn"></button>
```

After:

```html
<button class="btn btn--active"></button>
```

Only class attribute updates.

---

# What This Method Does NOT Do

It does NOT:

- remove elements
- rebuild DOM
- clear container

It only:

- updates text
- updates attributes

---

# Practical Example

User clicks “increase servings”.

Changes:

```
servings number
ingredient quantities
button active class
```

`update()` will modify only:

- number text nodes
- changed classes

Everything else stays untouched.

---

# Final Understanding

`render()` → full rebuild
`update()` → smart partial update

This is a manual DOM diffing technique to make UI updates efficient.

This section explains these methods:

- `_clear()`
- `renderSpinner()`
- `renderError()`
- `renderMessage()`

All of them are **UI helper methods** used to control what appears inside the view container (`this._parentElement`).

They are reused by different views like RecipeView, ResultsView, BookmarksView.

---

# `_clear()` — Remove Existing HTML

```js
_clear() {
  this._parentElement.innerHTML = '';
}
```

## What it does

Removes everything inside the parent container.

## Why it exists

Before inserting new markup, old markup must be removed.

## Example

Before:

```html
<div class="recipe">...old recipe content...</div>
```

After `_clear()`:

```html
<div class="recipe"></div>
```

Empty container — ready for fresh content.

---

# `renderSpinner()` — Show Loading Indicator

```js
renderSpinner = function () {
  const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;

  this._clear();
  this._parentElement.insertAdjacentHTML("afterbegin", markup);
};
```

## Purpose

Shows a loading spinner while data is being fetched from API.

## Step-by-step

### Create spinner HTML

```js
const markup = `<div class="spinner"> ... </div>`;
```

This builds the spinner structure.

### SVG icon usage

```js
<use href="${icons}#icon-loader">
```

- `icons` = imported SVG sprite file
- `#icon-loader` = specific icon inside sprite
- Efficient way to reuse icons

### Clear container first

```js
this._clear();
```

Removes previous content so spinner is visible alone.

### Insert spinner

```js
insertAdjacentHTML("afterbegin", markup);
```

Adds spinner as first child inside container.

---

# `renderError()` — Show Error Message

```js
renderError(message = this._errorMessage) {
  const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}.svg#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

  this._clear();
  this._parentElement.insertAdjacentHTML('afterbegin', markup);
}
```

## Purpose

Displays error UI when:

- recipe not found
- search fails
- API error occurs
- no data available

## Default parameter

```js
message = this._errorMessage;
```

Each child view defines its own error message:

```js
_errorMessage = "Recipe not found";
```

If no message passed → uses default.

## Markup structure

```
error box
  icon
  message text
```

## Example output

```
⚠ Recipe not found. Try another one.
```

---

# Important detail

You wrote:

```js
<use href="${icons}.svg#icon-alert-triangle">
```

If icons already contains `.svg`, adding `.svg` again will break path.

Correct pattern usually is:

```js
${icons}#icon-alert-triangle
```

---

# `renderMessage()` — Show Success/Info Message

```js
renderMessage(message = this._message) {
  const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `;

  this._clear();
  this._parentElement.insertAdjacentHTML('afterbegin', markup);
}
```

## Purpose

Shows positive feedback messages.

Used for things like:

- bookmark added
- recipe uploaded
- action successful

## Default parameter

```js
message = this._message;
```

Each view can define:

```js
_message = "Recipe uploaded successfully";
```

---

# Pattern You Should Notice

All render helpers follow same structure:

```
1. Build markup string
2. Clear container
3. Insert markup into parent element
```

That consistency is intentional — makes the View base class reusable.

---

# Mental Model to Keep

Think of this View class as:

```
render()        → show main content
update()        → smart partial update
_clear()        → wipe container
renderSpinner() → show loading state
renderError()   → show failure state
renderMessage() → show success/info state
```

# controller.js

## controlRecipes()

This controller function runs when:

- page loads
- URL hash changes
- user clicks a recipe in sidebar

It coordinates **model + multiple views**.

---

## Step 0 — Highlight Selected Search Result

```js
resultsView.update(model.getSearchResultsPage());
```

### What this line does (big idea)

It refreshes the **search results sidebar UI** so the currently selected recipe gets highlighted.

Without this → user clicks a recipe → recipe opens → but sidebar doesn’t visually show which one is active.

This keeps UI in sync.

---

## Break It Into Pieces

---

### 🔹 `model.getSearchResultsPage()`

**Model responsibility**

Returns only the recipes for the current page.

Example state:

```js
state.search = {
  page: 2,
  resultsPerPage: 10,
  results: [ ... 53 recipes ... ]
}
```

Function computes:

```js
start = (2-1)*10 = 10
end   = 2*10 = 20
```

Returns:

```
results[10..19]
```

Only page-2 recipes.

No DOM. Only data slicing.

---

### 🔹 `resultsView.update(...)`

**View responsibility**

`update()` runs the DOM-diff algorithm instead of full re-render.

It:

- compares current DOM vs new markup
- updates only changed parts
- keeps existing elements intact

---

### 🔹 Real App Example

User searches **“pizza”**

Sidebar shows:

```
Pizza A
Pizza B
Pizza C
Pizza D
```

User clicks **Pizza C**

URL hash changes → controller runs → this line executes:

```
resultsView.update(...)
```

Now markup marks Pizza C as:

```html
<li class="preview preview--active"></li>
```

Only that class changes — not whole sidebar.

Fast + efficient.

---

## Step 1 — Sync Bookmarks Sidebar

```js
bookmarksView.update(model.state.bookmarks);
```

### Purpose

Refresh bookmarks panel so bookmark icons and list stay correct.

---

### Why needed here?

When you open a recipe:

- it might already be bookmarked
- bookmark icon must show **filled**
- bookmarks sidebar may need highlight update

---

### Example

State:

```js
state.bookmarks = [
  { id: "abc", title: "Pasta" },
  { id: "xyz", title: "Burger" },
];
```

If opened recipe = Pasta → bookmark button becomes filled.

`update()` adjusts icon only — not full re-render.

---

## Step 2 — Load Recipe From API

```js
await model.loadRecipe(id);
```

### Model responsibility

Fetch + transform + store.

---

### Inside model.loadRecipe

It:

```
fetch API
parse JSON
transform fields
store in state.recipe
```

---

### Example API → state transform

API gives:

```json
{
  "image_url": "...",
  "source_url": "...",
  "cooking_time": 45
}
```

Model converts to:

```js
state.recipe = {
  image,
  sourceUrl,
  cooking_time,
};
```

Cleaner names for views.

---

### Why controller uses await

Because fetch is async.

Controller must wait before rendering:

```
load → then render
```

Not:

```
render → then load (would crash)
```

---

## Step 3 — Render Recipe UI

```js
recipeView.render(model.state.recipe);
```

### What render() does

Inside View base class:

```js
render(data){
  this._data = data;
  const markup = this._generateMarkup();
  this._clear();
  insert HTML
}
```

---

### recipeView.\_generateMarkup()

Builds full recipe HTML:

- image
- title
- servings
- ingredients
- buttons
- icons

Returns markup string.

---

### Why render() not update() here?

Because:

```
New recipe = totally new layout
```

We want full replace.

Use:

```
render() → full draw
```

`update()` is only for partial numeric/text changes.

---

## Full Control Flow Summary

```
User clicks recipe
   ↓
URL hash changes
   ↓
controlRecipes runs
   ↓
recipeView.renderSpinner()
   ↓
resultsView.update(...)        ← highlight sidebar item
bookmarksView.update(...)      ← sync bookmark UI
   ↓
await model.loadRecipe(id)     ← fetch data
   ↓
recipeView.render(...)         ← draw recipe
```

---

# controlSearchResults

This function controls what happens when a user searches for a recipe.
It connects **search input → model API call → results view → pagination view**.

We’ll go step-by-step with real app behavior examples.

---

```js
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1)get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)load search results
    await model.loadSearchResults(query);

    //3)render results
    resultsView.render(model.getSearchResultsPage());

    //4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
```

---

# Step 0 — Show Loading Spinner

```js
resultsView.renderSpinner();
```

## Why this runs first

Search API takes time. Without spinner → UI looks frozen.

So immediately:

```
results panel → shows loading icon
```

This gives user feedback that search is running.

---

# Step 1 — Get Search Query From Input

```js
const query = searchView.getQuery();
if (!query) return;
```

## What `getQuery()` does

Inside `searchView`:

- reads text from search input box
- clears the input field
- returns typed value

Example:

```
User types → "pizza"
getQuery() → returns "pizza"
input box → cleared
```

---

## Why the guard check

```js
if (!query) return;
```

Prevents empty searches.

Without this:

```
empty search → API call → useless request
```

Good defensive coding.

---

# Step 2 — Load Results From Model

```js
await model.loadSearchResults(query);
```

## What happens inside model

Model:

```
build API URL using query
fetch data
transform results
store in state.search.results
reset page = 1
```

---

## Example

Query = `"pizza"`

API returns 50 recipes →

Model stores:

```js
state.search = {
  query: "pizza",
  results: [ ...50 items... ],
  page: 1,
  resultsPerPage: 10
}
```

Nothing rendered yet — only data prepared.

---

# Step 3 — Render First Page of Results

```js
resultsView.render(model.getSearchResultsPage());
```

## Break it down

---

### 🔹 model.getSearchResultsPage()

Slices results based on:

```
page = 1
resultsPerPage = 10
```

Returns:

```
first 10 recipes only
```

Not all 50.

---

### 🔹 resultsView.render(...)

Full render (no update):

- clears results panel
- generates markup for 10 items
- inserts HTML

---

## Real App Example

User searches **pizza**

API → 50 recipes

UI shows:

```
10 recipes
```

Not 50 — because pagination.

---

# Step 4 — Render Pagination Buttons

```js
paginationView.render(model.state.search);
```

## Why pass entire search state

Pagination view needs:

```
total results
results per page
current page
```

From this it calculates:

```
how many pages exist
which buttons to show
```

---

## Example Calculation

```
results = 50
per page = 10
pages = 5
current = 1
```

Pagination view shows:

```
[Next →]
```

On page 3 it shows:

```
[← Prev]   [Next →]
```

On page 5 it shows:

```
[← Prev]
```

---

# Why Pagination Render Happens After Results Render

Because:

```
need results count first
then compute page count
then draw buttons
```

Correct order matters.

---

# Error Handling Block

```js
catch(err){
  console.log(err);
}
```

If API fails:

- prevents app crash
- logs error for debugging

You could later upgrade this to show UI error message.

---

# Full Search Flow Summary

```
User submits search
   ↓
controlSearchResults runs
   ↓
resultsView.renderSpinner()
   ↓
getQuery()
   ↓
await model.loadSearchResults()
   ↓
resultsView.render(page 1 results)
   ↓
paginationView.render(buttons)
```

---

## Why controller controls sequence

Because order is critical:

```
get query → load → slice → render → paginate
```

Controller orchestrates.

---

## Why we render page slice, not full results

Because:

```
performance
UX clarity
pagination support
```

---

# controlPagination

```js
const controlPagination = function (goToPage) {
  //1)Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //2)render initial pagination buttons
  paginationView.render(model.state.search);
};
```

---

## Purpose

This function runs when the user clicks a pagination button (Next / Previous page).

It:

1. Gets results for the selected page
2. Shows them on screen
3. Updates pagination buttons

---

## Function Header

```js
const controlPagination = function(goToPage)
```

- `goToPage` = page number user wants to go to
- Comes from pagination button click
- Example: page 2, page 3, etc.

---

## Step 1 — Render New Results

```js
resultsView.render(model.getSearchResultsPage(goToPage));
```

### What happens here:

### ➤ `model.getSearchResultsPage(goToPage)`

- Gets only the results for that specific page
- Example:

  - Total results = 40
  - Results per page = 10
  - Page 2 → returns results 11–20

### ➤ `resultsView.render(...)`

- Displays those results in the UI
- Old results are replaced with new ones

So when user clicks page 2 → new recipes appear.

---

## Step 2 — Render Pagination Buttons

```js
paginationView.render(model.state.search);
```

### Why needed?

Because buttons must change based on page:

- Page 1 → show **Next**
- Middle page → show **Prev + Next**
- Last page → show **Prev**

### What is passed?

```js
model.state.search;
```

This contains:

- current page
- total results
- results per page

Pagination view uses this to decide which buttons to show.

---

# `controlServings(newServings)`

```js
const controlServings = function (newServings) {
  //update the recipe servings
  model.updateServings(newServings);

  //update the recipe view
  recipeView.update(model.state.recipe);
};
```

## Purpose

This runs when user clicks:

➕ Increase servings
➖ Decrease servings

It updates ingredient quantities automatically.

---

## Function Header

```js
const controlServings = function(newServings)
```

- `newServings` = new serving count chosen by user
- Example: from 4 → 6

---

## Step 1 — Update Data in Model

```js
model.updateServings(newServings);
```

### What this does inside model:

- Changes:

  - servings value
  - ingredient quantities

Example:

```
Old: 2 servings → 100g flour
New: 4 servings → 200g flour
```

So model data is recalculated first.

---

## Step 2 — Update Recipe UI

```js
recipeView.update(model.state.recipe);
```

### Important: This uses `update()` — not `render()`

**Difference:**

| render()            | update()                    |
| ------------------- | --------------------------- |
| Rebuilds full HTML  | Only changes changed values |
| Slower              | Faster                      |
| Replaces everything | Smart patch update          |

So only ingredient numbers and servings text change — not whole page.

That’s more efficient.

---

# Flow Summary

## Pagination Flow

```
User clicks page button
   ↓
controlPagination runs
   ↓
Model gives results for that page
   ↓
ResultsView renders recipes
   ↓
PaginationView updates buttons
```

---

## Servings Flow

```
User clicks + or –
   ↓
controlServings runs
   ↓
Model recalculates ingredients
   ↓
RecipeView updates UI values
```

---

# Bookmark Controller Functions

```js
const controlAddBookmark = function () {
  //1)add / remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2)update recipe view
  recipeView.update(model.state.recipe);

  //3)render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
```

- Model → data changes
- View → UI updates

---

# `controlAddBookmark()`

## Purpose

Runs when the user clicks the **bookmark icon** on a recipe.

It will:

1. Add bookmark if not bookmarked
2. Remove bookmark if already bookmarked
3. Update recipe UI icon
4. Re-render bookmarks list

---

## Step 1 — Add or Remove Bookmark

```js
if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
else model.deleteBookmark(model.state.recipe.id);
```

### What this checks:

```js
model.state.recipe.bookmarked;
```

This is a boolean flag:

- `true` → recipe is already bookmarked
- `false` → not bookmarked yet

---

### Case A — Not bookmarked yet

```js
model.addBookmark(model.state.recipe);
```

This sends the current recipe to model.

Inside model:

- recipe is added to bookmarks array
- bookmarked flag becomes `true`
- may also save to localStorage

---

### Case B — Already bookmarked

```js
model.deleteBookmark(model.state.recipe.id);
```

This removes bookmark using recipe id.

Inside model:

- removes from bookmarks array
- bookmarked flag becomes `false`

---

## Step 2 — Update Recipe View

```js
recipeView.update(model.state.recipe);
```

### Why update here?

Because bookmark icon must change:

- → not bookmarked
- → bookmarked

`update()` is used instead of `render()` because:

- Only icon changes
- Faster DOM patch update
- No full re-render

---

## Step 3 — Render Bookmarks List

```js
bookmarksView.render(model.state.bookmarks);
```

Now the sidebar (or bookmarks panel) is refreshed.

It shows:

- newly added bookmark
- or removed bookmark gone

This keeps UI and data in sync.

---

# `controlBookmarks()`

## Purpose

This function renders bookmarks when app loads.

Usually called during **initialization**.

---

## Code

```js
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
```

### What it does:

- Reads bookmarks from model state
- Displays them in bookmarks view
- Often used after loading saved bookmarks from localStorage

---

# Full Flow When User Clicks Bookmark

```
User clicks bookmark icon
   ↓
controlAddBookmark runs
   ↓
Check bookmarked flag
   ↓
Add OR delete bookmark in model
   ↓
Recipe view icon updates
   ↓
Bookmarks list re-renders
```

---

# Important Insight

Notice the order is very intentional:

1️ Update data first (model)
2️ Then update UI (views)

Never do UI first — data must be source of truth.

---

# Add Recipe + Init Function

---

# `controlAddRecipe` — Upload New Recipe Controller

```js
const controlAddRecipe = async function(newRecipe){
```

## Purpose

Runs when the user submits the **Add Recipe form**.

It will:

1. Show loading spinner
2. Upload recipe to model (and API)
3. Render new recipe
4. Show success message
5. Add to bookmarks view
6. Update URL with new recipe ID
7. Close the modal window

---

## ⚠️ Why `async`?

Because uploading recipe takes time (API request).

So we use:

```
async / await
```

to handle asynchronous code cleanly.

---

## Step-by-Step Breakdown

---

## Step 1 — Show Loading Spinner

```js
addRecipeView.renderSpinner();
```

Shows spinner in the form window so user knows:

> “Processing… please wait”

Good UX practice.

---

## Step 2 — Upload Recipe to Model

```js
await model.uploadRecipe(newRecipe);
```

### What happens:

- Form data → sent to model
- Model sends data to API
- API returns created recipe
- Model stores it in:

```
model.state.recipe
```

`await` pauses execution until upload finishes.

---

## Step 3 — Check Console

```js
console.log(model.state.recipe);
```

Used only for debugging — shows uploaded recipe data.

---

## Step 4 — Render New Recipe

```js
recipeView.render(model.state.recipe);
```

Immediately shows the newly created recipe on screen.

So user sees their recipe right away.

---

## Step 5 — Show Success Message

```js
addRecipeView.renderMessage();
```

Displays something like:

```
 Recipe was successfully uploaded
```

Better user feedback.

---

## Step 6 — Re-render Bookmarks

```js
bookmarksView.render(model.state.bookmarks);
```

Why?

Because in your app logic:

- New recipe is auto-bookmarked
- So bookmarks sidebar must update

---

## Step 7 — Update URL Without Reload

```js
window.history.pushState(null, "", `#${model.state.recipe.id}`);
```

## What this does:

Changes URL hash:

```
before → /index.html
after  → /index.html#abc123
```

But:

- No page reload
- Browser history updated

This lets users:

- refresh page
- share recipe link

---

## Step 8 — Close Modal After Delay

```js
setTimeout(function () {
  addRecipeView.toggleWindow();
}, MODAL_CLOSE_SEC);
```

After a few seconds:

- form popup closes automatically

Why delay?
User gets time to see success message first.

---

## Error Handling Block

```js
catch(err){
  console.error('!!!',err);
  addRecipeView.renderError(err.message)
}
```

If upload fails:

- error logged in console
- error message shown in UI

Never skip error handling — this is solid structure.

---

# `init()` — Application Startup Function

Now the most important wiring section.

---

## Code

```js
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
```

---

# Purpose of `init()`

This function connects:

```
USER ACTIONS → VIEW HANDLERS → CONTROLLER FUNCTIONS
```

It sets up all event listeners in one place.

Think of it as:

> Plugging controller into every UI event.

---

# Handler Connections Explained

---

## Bookmarks Load Handler

```js
bookmarksView.addHandlerRender(controlBookmarks);
```

When page loads → render saved bookmarks.

---

## Recipe Render Handler

```js
recipeView.addHandlerRender(controlRecipes);
```

When URL hash changes → load recipe.

Example:

```
#5ed6604591c37cdc054bc886
```

---

## Servings Update Handler

```js
recipeView.addHandlerUpdateServings(controlServings);
```

When + / − clicked → update servings.

---

## Bookmark Click Handler

```js
recipeView.addHandlerAddBookmark(controlAddBookmark);
```

When bookmark icon clicked → toggle bookmark.

---

## Search Handler

```js
searchView.addHandlerSearch(controlSearchResults);
```

When search form submitted → run search.

---

## Pagination Handler

```js
paginationView.addHandlerClick(controlPagination);
```

When page button clicked → change results page.

---

## Upload Recipe Handler

```js
addRecipeView.addHandlerUpload(controlAddRecipe);
```

When add recipe form submitted → upload recipe.

---

# Final Line

```js
init();
```

This starts everything.

Without this — no handlers, no interactions.

App would load but do nothing.

---

# Big Architecture Insight (Important)

Your controller now follows a professional flow:

```
init()
  ↓
views listen for events
  ↓
handlers call controller
  ↓
controller updates model
  ↓
controller tells views to render/update
```

That’s real MVC behavior


#  `recipeView.js` 


It belongs to the **View layer** in MVC.

---

#  Imports

```js
import View from "./View.js";
import icons from "url:../../img/icons.svg";
import fracty from "fracty";
```

## What each import does

### View

Parent base class:

- render()
- update()
- spinner
- error rendering
- clear()

You inherit all of that.

---

### icons

Parcel converts SVG file into a usable URL string.

So you can do:

```html
<use href="${icons}#icon-clock"></use>
```

Instead of manually linking SVG files.

---

### fracty

Converts decimals → fractions.

Example:

```
0.25 → 1/4
0.5 → 1/2
```

Used for ingredient quantities display.

---

# Class Definition

```js
class recipeView extends View
```

Means:

```
recipeView inherits View methods
```

You only implement recipe-specific behavior here.

---

# Core Properties

```js
_parentElement = document.querySelector(".recipe");
_errorMessage = "We could not find that recipe , try another one ";
_message = "";
```

## \_parentElement

This is where recipe HTML is injected.

All rendering goes inside:

```
<div class="recipe"></div>
```

---

#  Event Handler Registration Methods

These allow controller to plug into view events.

Important pattern:
**View listens → Controller handles**

---

# addHandlerRender

```js
addHandlerRender(handler){
  ['hashchange','load'].forEach(ev =>
    window.addEventListener(ev, handler)
  );
}
```
window.addEventListener('hashchange', handler);
window.addEventListener('load', handler);


## Runs when:

- page loads
- URL hash changes

Example:

```
#5ed6604591c37cdc054bc886
```

Triggers recipe load.

Controller passes:

```
controlRecipes
```

---

#  addHandlerUpdateServings

```js
addHandlerUpdateServings(handler){
  this._parentElement.addEventListener('click', function(e){
    const btn = e.target.closest('.btn--tiny');
    if(!btn) return;

    const {updateTo} = btn.dataset;
    if(updateTo > 0) handler(+updateTo);
  })
}
```

## What’s happening

### Event delegation

Listen once on parent instead of each button.

---

### Find clicked button

```
.closest('.btn--tiny')
```

Works even if SVG inside button is clicked.

---

### Read dataset

```js
data-update-to="6"
```

comes as string → converted to number:

```
+updateTo
```

Controller receives new servings count.

---

#  addHandlerAddBookmark

```js
addHandlerAddBookmark(handler){
  this._parentElement.addEventListener('click', function(e){
    const btn = e.target.closest('.btn--bookmark');
    if (!btn) return;
    handler();
  });
}
```

When bookmark button clicked → controller toggles bookmark.

Clean separation:
View detects click → Controller changes data.

---

#  \_generateMarkup() — Main HTML Builder

This method returns **entire recipe HTML string**.

Called by:

```
render()
update()
```

Uses:

```
this._data
```

(which comes from controller → model → view)

---

# Header Section

```js
this._data.image;
this._data.title;
```

Displays recipe image and title.

---

# ⏱ Cooking Time Block

```js
this._data.cooking_time;
```

With clock SVG icon.

---

#  Servings Buttons

```js
data-update-to="${this._data.servings - 1}"
data-update-to="${this._data.servings + 1}"
```

These values feed directly into servings handler.

That’s how clicking buttons sends new serving count.

---

#  User Generated Badge

```js
${this._data.key ? ' ' : 'hidden'}
```

## Logic

If recipe has API key → show user icon
Else → hide it

Conditional class injection.

---

#  Bookmark Icon Toggle

```js
icon-bookmark${this._data.bookmarked ? '-fill':''}
```

## Result

| bookmarked | icon    |
| ---------- | ------- |
| false      | outline |
| true       | filled  |

Dynamic SVG reference — very efficient.

---

#  Ingredients List

```js
this._data.ingredients.map(this._generateMarkupIngredient).join(" ");
```

## Flow

Each ingredient → HTML row → combined string.

Classic map → join pattern.

---

# Ingredient Row Generator

```js
_generateMarkupIngredient(ing);
```

## Fraction Conversion

```js
ing.quantity ? fracty(ing.quantity) : " ";
```

Better UX than decimals.

---

# Directions Button

```js
href = "${this._data.sourceUrl}";
target = "_blank";
```

Opens original recipe site in new tab.

Good usability decision.

---

#  Export Instance

```js
export default new recipeView();
```

Not exporting class — exporting single object.

Why?

Because you only need one recipe view.

Singleton pattern.

---

#  `resultsView.js`

This file controls the **search results list UI** — the recipes you see after typing something in the search bar.

It is a **View class** that:

- receives search results data
- converts each result into preview cards
- renders them into the results container

Short file — but important in architecture.

Let’s go line by line.

---

# Imports

```js
import icons from "url:../../img/icons.svg";
import View from "./View.js";
import previewView from "./previewView.js";
```

## What these do

### icons

SVG sprite file converted by Parcel.

 Note: In this file, icons are **not actually used** — safe but unnecessary import.

---

### View

Base class that gives:

- render()
- update()
- renderSpinner()
- renderError()
- clear()

resultsView inherits these.

---

### previewView

Another view class that creates **single recipe preview card markup**.

**Each search result item is rendered using previewView.**

So resultsView does:

```
list container
  → asks previewView to build each row
```

Good separation of responsibility.

---

#  Class Definition

```js
class resultsView extends View
```

Means:

```
resultsView gets all View base methods
```

You only implement container-specific markup logic.

---

# Core Properties

```js
_parentElement = document.querySelector(".results");
_errorMessage = "No recipe found for your query! please try again";
_message = "";
```

## \_parentElement

Where results are rendered:

```
<ul class="results"></ul>
```

render() inserts markup here.

---

## \_errorMessage

Used when:

```
results array is empty
```

Then View.renderError() shows this message.

---

#  \_generateMarkup()

This is the only custom method here.

```js
_generateMarkup(){
  return this._data
    .map(bookmark => previewView.render(bookmark,false))
    .join('');
}
```

Let’s break this carefully.

---

#  What is `this._data` here?

From controller:

```js
resultsView.render(model.getSearchResultsPage(page));
```

So:

```
this._data = array of search result recipes
```

Example:

```
[
 {id, title, publisher, image},
 {id, title, publisher, image}
]
```

---

#  map() Over Results

```js
.map(bookmark => ...)
```

 Variable name “bookmark” is misleading — these are **results**, not bookmarks.

Better name would be:

```
result
item
recipe
```

But code still works — just confusing naming.

---

#  previewView.render(bookmark, false)

This is a special pattern.

Normally:

```
render(data)
```

→ inserts into DOM.

But here:

```
render(data, false)
```

## What false means

In your base View class:

```
render(data, render = true)
```

If render = false:

- it RETURNS markup string
- does NOT insert into DOM

So previewView builds HTML string only.

Smart reuse of render logic.

---

#  Why Use previewView Here?

Because previewView knows how to build:

```
single recipe card markup
```

resultsView should not duplicate that logic.

Architecture win:

```
resultsView = list manager
previewView = item renderer
```

---

#  join('')

After map:

```
[ "<li>..</li>", "<li>..</li>" ]
```

join converts array → single HTML string.

Without join → commas appear in HTML.

---

# Export

```js
export default new resultsView();
```

Exports single instance.

Controller imports and calls:

```
resultsView.render(...)
```

---



## Search Flow

```
User searches
   ↓
controller gets results
   ↓
resultsView.render(resultsArray)
   ↓
_generateMarkup runs
   ↓
previewView builds each item
   ↓
All items joined
   ↓
Inserted into .results container
```

---


You’re progressing well through the view layer now. Next file should be:



#  `SearchView.js` 

This file handles the **search bar behavior** in your app.

It is a small but important View class that:

- reads what the user typed
- clears the input field
- listens for search form submit
- calls the controller search function


---

#  Class Definition

```js
class SearchView {
```

This is a plain class — not extending `View`.

Why?

Because:

- It doesn’t render HTML
- It only reads input and listens to submit events

So base View features are not needed.

---

#  Parent Element

```js
_parentEl = document.querySelector(".search");
```

This selects the search form container:

```html
<form class="search"></form>
```

All event listening happens on this element.

---

#  getQuery()

```js
getQuery(){
  const query = this._parentEl
    .querySelector('.search__field')
    .value;

  this._clearInput();
  return query;
}
```

##  Purpose

Gets the text user typed into the search box.

---

## Step-by-step

### Read input value

```js
.querySelector('.search__field').value
```

Example user types:

```
pizza
```

query = `"pizza"`

---

### Clear input after reading

```js
this._clearInput();
```

So the search field becomes empty after submit.

Good UX.

---

### Return query to controller

Controller uses it like:

```js
const query = searchView.getQuery();
```

---

#  \_clearInput()

```js
_clearInput(){
  this._parentEl
    .querySelector('.search__field')
    .value = '';
}
```

## Purpose

Resets search box.

Private helper method (underscore naming convention).

---

#  addHandlerSearch()

```js
addHandlerSearch(handler){
  this._parentEl.addEventListener('submit', function(e){
    e.preventDefault();
    handler();
  });
}
```

##  Purpose

Connects form submit → controller search function.

---

## Step-by-step

### Listen to submit event

Triggered when:

- user presses Enter
- user clicks search button

---

### Prevent page reload

```js
e.preventDefault();
```

Without this:

- browser reloads page
- app state lost

Always required for JS form handling.

---

### Call controller

```js
handler();
```

Controller passed:

```
controlSearchResults
```

So flow becomes:

```
User submits search
   ↓
SearchView catches submit
   ↓
Controller function runs
   ↓
Model fetches results
   ↓
ResultsView renders
```

---


## SearchView handles:

- reading input
- clearing input
- submit event

## Controller handles:

- what to do with query
- fetching results
- rendering results

That’s clean MVC thinking.

---

# Real App Flow With This File

```
User types "pasta"
   ↓
Press Enter
   ↓
addHandlerSearch fires
   ↓
controlSearchResults()
   ↓
searchView.getQuery()
   ↓
Model API call
   ↓
Results render
```

---

# `PaginationView.js` 

This file controls your **pagination buttons UI** — the Next / Previous page buttons that appear under search results.

It is a View class that:

- calculates how many pages exist
- decides which buttons to show
- listens for pagination button clicks
- tells the controller which page to load

This file is small but very logic-heavy — so read this carefully.

---

#  Imports

```js
import View from "./View.js";
import icons from "url:../../img/icons.svg";
```

## View

Base class gives you:

- render()
- update()
- renderError()
- renderSpinner()
- clear()

PaginationView only needs to generate markup.

---

## icons

SVG sprite for arrows:

```
icon-arrow-left
icon-arrow-right
```

Used in pagination buttons.

---

#  Class Definition

```js
class PaginationView extends View
```

So this class:

- inherits base rendering methods
- only implements pagination-specific markup + click handler

---

#  Parent Element

```js
_parentElement = document.querySelector(".pagination");
```

Pagination buttons are rendered inside:

```
<div class="pagination"></div>
```

---

#  addHandlerClick()

```js
addHandlerClick(handler){
  this._parentElement.addEventListener('click', function(e){
    const btn = e.target.closest('.btn--inline');
    if (!btn) return;

    const goToPage = +btn.dataset.goto;
    handler(goToPage);
  })
}
```

##  Purpose

Listens for clicks on pagination buttons and sends page number to controller.

---

## Step-by-step

### Event delegation

Listen once on container instead of each button.

---

### Find clicked button

```js
e.target.closest(".btn--inline");
```

Works even if user clicks SVG inside button.

---

### Read dataset value

Buttons contain:

```html
data-goto="3"
```

Accessed via:

```js
btn.dataset.goto;
```

---

### Convert to number

```js
+btn.dataset.goto;
```

Unary plus converts string → number.

---

### Call controller

```js
handler(goToPage);
```

Controller function:

```
controlPagination(page)
```

---

#  \_generateMarkup()

This builds pagination button HTML depending on:

```
current page
total pages
```

---

#  Page Calculations

```js
const curPage = this._data.page;
const numPages = Math.ceil(
  this._data.results.length / this._data.resultsPerPage
);
```

## Example

```
results.length = 23
resultsPerPage = 10

numPages = 3
```

Math.ceil ensures partial pages count.

---

#  Case 1 — Page 1 + More Pages Exist

```js
if (curPage === 1 && numPages > 1)
```

## Show only NEXT button

User cannot go backward from page 1.

---

## Button markup

```html
data-goto="2"
```

Click → go to page 2.

---

#  Case 2 — Last Page

```js
if (curPage === numPages && numPages > 1)
```

## Show only PREVIOUS button

No next page available.

---

#  Case 3 — Middle Pages

```js
if (curPage < numPages)
```

## Show BOTH buttons

- Previous
- Next

User can navigate both directions.

---

#  Case 4 — Only One Page

```js
return "";
```

No buttons rendered.

Because pagination not needed.

---

#  Important Bug — Extra Spaces in data-goto

You wrote:

```html
data-goto=" ${curPage-1}"
```

There is a **leading space inside quotes**.

##  Problem

Dataset becomes:

```
" 2"
```

Unary plus may still work — but it’s sloppy and risky.

---

##  Fix ALL these:

```js
data-goto="${curPage-1}"
data-goto="${curPage+1}"
```

Remove spaces inside quotes.

Do this in:

- prev button
- next button
- middle case buttons

---

#  Data That Comes Into This View

Controller sends:

```js
paginationView.render(model.state.search);
```

So `_data` contains:

```
{
  results: [...],
  page: number,
  resultsPerPage: number
}
```

PaginationView does NOT fetch — only calculates.

---

#  Full Pagination Flow

```
User clicks page button
   ↓
PaginationView detects click
   ↓
Reads data-goto
   ↓
Calls controlPagination(page)
   ↓
Controller gets results slice
   ↓
ResultsView renders new page
   ↓
PaginationView re-renders buttons
```

---

#  Design Strength Here

You correctly separated:

## PaginationView

- button display logic
- click detection

## Controller

- what to do when page changes

That separation prevents tight coupling — very good architecture practice.

---



#  `bookmarksView.js` 

This file controls the **Bookmarks sidebar list UI** — the recipes the user has bookmarked.

It is very similar to `resultsView`, but instead of showing search results, it shows:

saved bookmarked recipes

It is a View class that:

- renders bookmarks list
- shows message if no bookmarks exist
- loads bookmarks when app starts
- reuses previewView for each bookmark item

Let’s go step by step.

---

#  Imports

```js
import icons from "url:../../img/icons.svg";
import View from "./View.js";
import previewView from "./previewView.js";
```

## View

Base class providing:

- render()
- update()
- renderError()
- renderSpinner()
- clear()

bookmarksView inherits these.

---

## previewView

Responsible for rendering **one small recipe preview card**.

This avoids duplicating markup logic.

Used for:

```
results list items
bookmarks list items
```

Good reuse design.

---


#  Class Definition

```js
class bookmarksView extends View
```

So it inherits base rendering behavior and only defines:

- where to render
- how to generate markup
- when to render on load

---

#  Parent Element

```js
_parentElement = document.querySelector(".bookmarks__list");
```

Bookmarks are rendered inside:

```
<ul class="bookmarks__list"></ul>
```

render() inserts HTML here.

---

#  Default Messages

```js
_errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it";
_message = "";
```

## When shown?

If:

```
this._data is empty array
```

Then View.renderError() displays this message.



---

#  addHandlerRender()

```js
addHandlerRender(handler){
  window.addEventListener('load', handler);
}
```

##  Purpose

Runs handler when page loads.

Controller connects:

```
controlBookmarks
```

So bookmarks are rendered immediately at startup.

---

## Flow

```
Page loads
   ↓
bookmarksView handler fires
   ↓
controller controlBookmarks()
   ↓
bookmarksView.render(state.bookmarks)
```

This ensures saved bookmarks appear automatically.

---

#  \_generateMarkup()

```js
_generateMarkup(){
  return this._data
    .map(bookmark => previewView.render(bookmark, false))
    .join('');
}
```

## What happens here

### this.\_data

Controller passes:

```
model.state.bookmarks
```

Which is an array of bookmarked recipes.

---

### map()

Each bookmark object → previewView markup.

---

### previewView.render(bookmark, false)

Important pattern again:

```
render(data, false)
```

Means:

- return markup string
- DO NOT insert into DOM

So previewView acts as a markup factory.

---

### join('')

Combines array of markup strings into one HTML block.

Prevents commas in HTML output.



#  How This Fits In App Flow

## When Bookmark Added/Removed

```
User clicks bookmark
   ↓
controller updates model.bookmarks
   ↓
bookmarksView.render(state.bookmarks)
   ↓
Sidebar list updates
```

---

## When App Starts

```
App loads
   ↓
init() registers handler
   ↓
bookmarksView load handler fires
   ↓
render saved bookmarks
```

---

#  Architecture Win Here

You reused previewView again instead of rewriting card markup.

That gives:

single source of markup truth
consistent UI
less maintenance
fewer bugs

That’s how real apps are structured.

---


# `addRecipeView.js` 

This file controls your **Add Recipe modal form UI** — the popup window where users submit a new recipe.

This view handles:

- opening the modal
- closing the modal
- overlay behavior
- reading form data
- sending form data to controller
- showing success message after upload

It extends your base `View` class, but it **does not generate recipe markup** — instead it works with a form.

Let’s go step by step.

---

#  Imports

```js
import View from "./View.js";
import icons from "url:../../img/icons.svg";
```

## View

Gives this class:

- renderSpinner()
- renderMessage()
- renderError()
- clear()

Used after recipe upload.

---


# Class Definition

```js
class addRecipeView extends View
```

This is a View subclass focused on:

```
modal + form behavior
```

Not markup rendering.

---

#  Core Elements

```js
_parentElement = document.querySelector(".upload");
_message = "Recipe was successfully uploaded";
```

## \_parentElement

This is the form element:

```
<form class="upload">
```

Submit handler is attached here.

---

## \_message

Used by:

```
renderMessage()
```

Shows success message after upload.

---

# Modal Elements

```js
_window = document.querySelector(".add-recipe-window");
_overlay = document.querySelector(".overlay");
_btnOpen = document.querySelector(".nav__btn--add-recipe");
_btnClose = document.querySelector(".btn--close-modal");
```

These control modal visibility.

---

#  Constructor

```js
constructor(){
  super();
  this._addHandlerShowWindow();
  this._addHandlerHideWindow();
}
```

## Why constructor runs code?

When this class instance is created:

```
export default new addRecipeView()
```

Constructor runs immediately and attaches button listeners.

No controller involvement needed here — this is pure UI behavior.

---

#  toggleWindow()

```js
toggleWindow(){
  this._overlay.classList.toggle('hidden');
  this._window.classList.toggle('hidden');
}
```

## Purpose

Shows / hides modal + overlay.

If hidden → show
If visible → hide

CSS class `hidden` controls display.

---

# Show Modal Handler

```js
_addHandlerShowWindow(){
  this._btnOpen.addEventListener(
    'click',
    this.toggleWindow.bind(this)
  );
}
```

## Why `.bind(this)` is critical

Without bind:

```
this → button element
```

With bind:

```
this → class instance
```



---

# Hide Modal Handlers

```js
_addHandlerHideWindow(){
  this._btnClose.addEventListener('click',
    this.toggleWindow.bind(this));

  this._overlay.addEventListener('click',
    this.toggleWindow.bind(this));
}
```

Modal closes when:

- close button clicked
- overlay clicked

---

#  addHandlerUpload()

```js
addHandlerUpload(handler){
  this._parentElement.addEventListener('submit', function(e){
    e.preventDefault();

    const dataArr = [...new FormData(this)];
    const data = Object.fromEntries(dataArr);

    handler(data);
  });
}
```

## This is very important logic — understand it well

---

## Step 1 — Listen to form submit

Triggered when user clicks Upload.

---

## Step 2 — Prevent page reload

```js
e.preventDefault();
```

Always required for JS form handling.

---

## Step 3 — Read Form Data

```js
new FormData(this);
```

Creates key/value pairs from form fields.

Example result:

```
[
 ['title','Pizza'],
 ['publisher','John'],
 ['ingredient-1','0.5,kg,flour']
]
```

---

## Step 4 — Spread into array

```js
[...new FormData(this)];
```

Because FormData is iterable.

---

## Step 5 — Convert to object

```js
Object.fromEntries(dataArr);
```

Converts:

```
[ ['title','Pizza'] ]
```

into:

```
{ title: 'Pizza' }
```

Very modern and clean JS.

---

## Step 6 — Send to controller

```js
handler(data);
```

Controller receives:

```
controlAddRecipe(data)
```

Then model uploads recipe.

---

#  \_generateMarkup()

```js
_generateMarkup(){ }
```

Empty — correct here.

Why?

This view does not render template markup — it works with existing HTML form.

So base View.render() is not used here for template generation.

---

# Full Upload Flow

```
User opens modal
   ↓
fills form
   ↓
submit
   ↓
addHandlerUpload fires
   ↓
form data → object
   ↓
controlAddRecipe(data)
   ↓
model.uploadRecipe()
   ↓
recipeView.render()
   ↓
success message shown
   ↓
modal closes
```

