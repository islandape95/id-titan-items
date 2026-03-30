# Island Defense — Titan Item Tree

Interactive item tree visualizer, editor, and changelog for **Island Defense** Titan items.

**Live site:** [islandape95.github.io/id-titan-items](https://islandape95.github.io/id-titan-items/)

---

## Pages

| Page | URL | What it does |
|------|-----|--------------|
| **Visualizer** | `index.html` | Browse the full item tree. Filter by category, toggle "changes only" to highlight diffs between versions. |
| **Editor** | `editor.html` | Create/edit versions. Add, modify, or remove items. Export & import versions as JSON. |
| **Changelog** | `changelog.html` | Side-by-side diff of any two versions with inline highlights (red = removed, green = added). |

---

## Important: Local Storage

All edits you make on the live site are saved **in your browser's local storage**.
They are **not** uploaded anywhere and **will be lost** if you clear your browser data.

**Always export your version as JSON** (Editor > Export) to keep a backup.

---

## How to Submit Your Version

Want your item changes saved permanently on the site? Follow these steps:

### 1. Export your version
Open the **Editor** > pick your version > click **Export**. This downloads a `.json` file.

### 2. Upload it to the `versions/` folder
- Go to the GitHub repo: [github.com/islandape95/id-titan-items](https://github.com/islandape95/id-titan-items)
- Navigate to the **`versions/`** folder
- Click **Add file > Upload files**
- Drop your `.json` file in
- Name your commit something like `Add version: my-version-name`
- Select **"Create a new branch"** and click **Propose changes**
- This opens a **Pull Request** — done!

A maintainer will review and merge it. Once merged, the version appears on the live site for everyone.

### 3. Alternative: Fork & PR
```
git clone https://github.com/islandape95/id-titan-items.git
cp my-export.json versions/
git add versions/my-export.json
git commit -m "Add version: my-version-name"
git push origin my-branch
# Then open a Pull Request on GitHub
```

---

## Running Locally

Just open `index.html` in a browser. No build step, no server required.

---

## Project Structure

```
index.html          — Visualizer page
editor.html         — Editor page
changelog.html      — Changelog page
css/styles.css      — All styles
js/
  items-data.js     — Base item definitions (source of truth)
  versions.js       — Version management (localStorage)
  suggestions-data.js — Pre-loaded "decent version" with community suggestions
  community-versions.js — Auto-loads versions from the versions/ folder
  tree.js           — Visualizer logic (layout, cards, tooltips)
  editor.js         — Editor logic (form, sidebar, import/export)
  changelog.js      — Changelog diff rendering
versions/           — Drop exported JSON files here to share them
```
