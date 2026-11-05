# DevCodeSnap

**Capture it. Organize it. Reuse it.**

DevCodeSnap is an open-source, local-first Chrome extension designed to help developers capture, organize, manage, and reuse useful code snippets directly from webpages.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)

---

## Table of Contents

- [About the Project](#about-the-project)
  - [The Problem](#the-problem)
  - [The Solution](#the-solution)
  - [Local-First Philosophy](#local-first-philosophy)
  - [Project Goals](#project-goals)
- [Features](#features)
  - [Implemented](#implemented)
  - [Planned](#planned)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Installation and Development Setup](#installation-and-development-setup)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Available Development Commands](#available-development-commands)
  - [Build the Chrome Extension](#build-the-chrome-extension)
  - [Load the Extension in Chrome](#load-the-extension-in-chrome)
- [Project Architecture](#project-architecture)
- [Data and Privacy](#data-and-privacy)
- [Testing](#testing)
- [Open Source](#open-source)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## About the Project

### The Problem

While reading technical documentation, Stack Overflow threads, GitHub repositories, and engineering blogs, developers frequently encounter valuable code snippets, configuration patterns, and command-line recipes. Today, preserving these snippets typically requires:

- Switching context to open separate desktop notes or text editors.
- Pasting code into unorganized scratchpads or temporary chat windows.
- Relying on third-party cloud tools that require accounts, network access, or subscription plans.

Over time, this fragmentation makes finding previously discovered solutions slow and inefficient.

### The Solution

DevCodeSnap provides an integrated browser extension workflow that captures code right where developers discover it. With quick action popups, background page messaging, and an in-browser management dashboard, developers can catalog solutions without leaving their browsing flow.

### Local-First Philosophy

DevCodeSnap is designed around a **local-first** architecture:

- **Browser-local storage:** Your code snippets, metadata, and tags live locally on your device inside IndexedDB.
- **Offline functionality:** The extension operates without requiring an internet connection.
- **Data ownership:** No mandatory user accounts, remote databases, or cloud servers are required to capture and manage your code.
- **Privacy by design:** Your code never leaves your browser unless you explicitly choose to export or backup your library.

### Project Goals

- **Make snippet collection effortless:** Capture selected code or code blocks from web pages with minimal friction.
- **Structured organization:** Categorize snippets into collections and tag them for quick retrieval.
- **Fast retrieval:** Search, filter, and access your code library directly within Google Chrome.
- **Data portability:** Provide comprehensive export (source files, Markdown, JSON) and backup capabilities.
- **User control:** Keep all saved data securely in browser-local storage with no vendor lock-in.

---

## Features

### Implemented

The following foundational capabilities are implemented and verified in the repository:

- **Manifest V3 Architecture:** Built with modern Chrome Extension Manifest V3 standards, including a background service worker lifecycle handler and content script communication channels.
- **Multi-Surface Entry Points:**
  - **Action Popup (`src/popup/`):** Quick extension popup with lightweight capture layout.
  - **Dashboard Page (`src/pages/dashboard/`):** Full-tab view scaffold for managing snippet libraries.
  - **Options & Settings (`src/pages/settings/`):** Configuration interface for user preferences.
- **UI Design System Foundation:** Built with React 18, Tailwind CSS, Lucide icons, and accessible Radix UI primitives (`Badge`, `Button`, `Card`).
- **Database Layer (Dexie.js / IndexedDB):** Typed database client (`DevCodeSnapDB`) with versioned schema migrations (`v1`) defining schemas for snippets, collections, tags, and snippet-tag relationships.
- **Automated Unit Testing:** Vitest test environment with in-memory `fake-indexeddb` executing automated tests for database operations and schema integrity.
- **Quality Tooling:** Strict TypeScript 5 configuration, ESLint 9 flat config, and Prettier code formatting with Tailwind CSS class sorting.

### Planned

The following product capabilities are approved on the development roadmap and scheduled for upcoming implementation phases:

- **Selection-Based Code Capture:** Select text on any webpage and capture it directly via context menu or keyboard shortcut.
- **Code-Block Capture:** Automated detection and one-click capture for standard `<pre>` and `<code>` HTML blocks.
- **Snippet Management & Editing:** Full snippet editor supporting custom titles, programming language detection/selection, markdown notes, tags, and source URL tracking.
- **Collections & Tags:** Flexible organizational system supporting named collections and reusable tags.
- **Favorites:** Quick bookmarking for frequently referenced snippets.
- **Search & Filtering:** Fast multi-field search across titles, code content, tags, and languages.
- **Multi-Format Export:** Export individual snippets or selected batches to native source code files, Markdown, and JSON.
- **ZIP Archive Export:** Package multiple snippet files and metadata into a single downloadable ZIP archive.
- **Backup & Restore:** Full local database backup to a single portable JSON file and restore with schema validation.

> _Note: Planned features represent approved roadmap milestones and are not yet available in the current development build._

---

## Screenshots

> _Interface screenshots will be added here as UI workflows and snippet management views reach visual maturity._

---

## Technology Stack

DevCodeSnap relies exclusively on the following verified dependencies and tools configured in the repository:

| Layer                    | Technology                                                                                      | Purpose                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Frontend Framework**   | [React 18](https://react.dev/)                                                                  | Component-based user interface for popup, dashboard, and settings          |
| **Language**             | [TypeScript 5](https://www.typescriptlang.org/)                                                 | End-to-end type safety, interfaces, and strict checking                    |
| **Extension Platform**   | [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)         | Modern extension background service worker, popup, and content script APIs |
| **Build & Bundling**     | [Vite 5](https://vitejs.dev/) & [@crxjs/vite-plugin](https://crxjs.geekcademy.com/)             | Fast HMR development and Manifest V3 extension bundling                    |
| **Styling**              | [Tailwind CSS 3](https://tailwindcss.com/)                                                      | Utility-first responsive styling with dark/light design token support      |
| **Component Primitives** | [@radix-ui/react-slot](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)         | Accessible composable UI components and iconography                        |
| **Local Database**       | [Dexie.js 4](https://dexie.org/)                                                                | Minimalist, type-safe wrapper for browser-native IndexedDB                 |
| **Testing**              | [Vitest 2](https://vitest.dev/) & [fake-indexeddb](https://github.com/dumbmatter/fakeIndexedDB) | Fast unit test runner with simulated IndexedDB support                     |
| **Code Quality**         | [ESLint 9](https://eslint.org/) & [Prettier 3](https://prettier.io/)                            | Automated linting, code style enforcement, and Tailwind class sorting      |

---

## Installation and Development Setup

Follow these steps to set up, build, and run the project locally.

### Prerequisites

Ensure you have the following installed on your workstation:

- **Node.js:** v18.0.0 or higher recommended (compatible with Vite 5 and modern ECMAScript modules).
- **npm:** v9.0.0 or higher recommended.
- **Google Chrome:** Latest stable version (or a Chromium-based browser supporting Manifest V3).

### Clone the Repository

```bash
git clone https://github.com/Leogabson/DevCodeSnap.git
cd DevCodeSnap
```

### Install Dependencies

```bash
npm install
```

### Available Development Commands

The repository provides the following npm scripts configured in `package.json`:

| Command                | Action                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`          | Starts the Vite development server with hot module replacement (HMR).                 |
| `npm run build`        | Runs TypeScript compilation (`tsc --noEmit`) and packages the extension into `dist/`. |
| `npm run typecheck`    | Validates TypeScript types across the codebase without emitting files.                |
| `npm run lint`         | Lints project files using ESLint 9 (`--max-warnings 0`).                              |
| `npm run lint:fix`     | Automatically fixes fixable ESLint warnings and errors.                               |
| `npm run format:check` | Checks code formatting against Prettier rules.                                        |
| `npm run format`       | Automatically formats project files with Prettier.                                    |
| `npm run test`         | Executes unit tests once using Vitest (`vitest run`).                                 |

### Build the Chrome Extension

To generate the extension bundle for Chrome:

```bash
npm run build
```

This compiles TypeScript source files, builds HTML pages, processes Tailwind styles, and outputs the production bundle to the **`dist/`** directory.

### Load the Extension in Chrome

DevCodeSnap is currently intended for local development, testing, and evaluation. To load the extension in Google Chrome:

1. Open Google Chrome.
2. In the address bar, navigate to `chrome://extensions`.
3. In the upper-right corner of the Extensions page, enable the **Developer mode** toggle.
4. Click the **Load unpacked** button in the top-left toolbar.
5. In the file picker, select the generated **`dist`** directory inside the `DevCodeSnap` repository.
6. Confirm that **DevCodeSnap** appears in the extensions list with its icon, version (`v0.1.0`), and permissions (`storage`, `activeTab`).

> _Note: DevCodeSnap is actively under development and is not yet published on the Chrome Web Store._

---

## Project Architecture

The repository enforces a clean separation of responsibilities across extension entry points, shared UI primitives, database access, and tests:

```text
DevCodeSnap/
├── public/                 # Static assets and extension icons (16px, 32px, 48px, 128px)
├── src/
│   ├── background/         # Manifest V3 service worker (lifecycle & message routing)
│   ├── components/         # Shared presentation layer
│   │   └── ui/             # Reusable UI primitives (Badge, Button, Card)
│   ├── constants/          # Application-wide constants, message types, and default values
│   ├── content/            # Content script foundation for DOM interaction and page messaging
│   ├── db/                 # Local database infrastructure (Dexie.js IndexedDB client)
│   │   ├── migrations/     # Versioned database schema migrations (v1)
│   │   ├── database.ts     # DevCodeSnapDB class initialization
│   │   └── schema.ts       # Table schemas and TypeScript database contracts
│   ├── lib/                # Shared helper utilities (e.g., class name merger cn)
│   ├── pages/              # Standalone extension HTML pages
│   │   ├── dashboard/      # Full-tab management dashboard (DashboardApp.tsx)
│   │   └── settings/       # Options and preferences page (SettingsApp.tsx)
│   ├── popup/              # Action popup interface and quick capture view (App.tsx)
│   ├── styles/             # Global CSS styling and Tailwind design tokens (globals.css)
│   └── types/              # Central domain types and extension message interfaces
├── tests/
│   └── unit/               # Automated unit tests (database operations, schema validations)
├── manifest.json           # Chrome Extension Manifest V3 configuration
├── package.json            # Project dependencies, metadata, and scripts
├── tailwind.config.js      # Tailwind CSS styling and theme configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration with @crxjs/vite-plugin
└── vitest.config.ts        # Vitest test runner configuration
```

### Key Architectural Boundaries

- **Extension Entry Points:** `src/background/` acts as the event-driven service worker, while `src/content/` handles page interaction. User interfaces are isolated into `src/popup/` (toolbar action), `src/pages/dashboard/` (full tab), and `src/pages/settings/` (options).
- **UI Components:** Presentation components in `src/components/ui/` remain decoupled from business logic and database interactions.
- **Database Infrastructure:** All IndexedDB interactions are centralized under `src/db/` using Dexie.js, ensuring consistent schema definition, versioning, and transaction handling.
- **Testing:** Unit test files located under `tests/unit/` run independently using mock environments (`fake-indexeddb`), avoiding dependency on a live browser instance.

---

## Data and Privacy

DevCodeSnap is designed with user data sovereignty as a primary principle:

- **Local Storage:** All snippet content, titles, programming languages, tags, and collections are saved directly within your browser's local IndexedDB database.
- **Preferences:** Lightweight extension settings (such as UI themes) use Chrome's local storage API (`chrome.storage.local`).
- **No Remote Accounts:** No account registration, authentication tokens, or cloud servers are required to use the extension.
- **No Third-Party Telemetry:** The initial release scope does not include external analytics, snippet tracking, or cloud synchronization services.
- **Transparent Boundaries:** Your saved code remains on your machine and under your full control at all times.

---

## Testing

The project incorporates automated unit testing alongside manual browser verification:

- **Automated Tests:** Unit tests run via [Vitest](https://vitest.dev/) with [fake-indexeddb](https://github.com/dumbmatter/fakeIndexedDB) providing an in-memory IndexedDB environment to test database schemas, operations, and constraints.
- **Run Tests:**
  ```bash
  npm run test
  ```
- **Manual Verification:** Build the extension (`npm run build`) and load the `dist/` directory into Chrome via `chrome://extensions` to manually verify popup rendering, dashboard navigation, and background worker lifecycle behavior.

> _Note: Test coverage currently verifies foundational database operations and will expand alongside upcoming feature modules._

---

## Open Source

DevCodeSnap is an open-source project dedicated to giving developers full control over their code snippet libraries.

- **Repository:** [https://github.com/Leogabson/DevCodeSnap](https://github.com/Leogabson/DevCodeSnap)
- **License:** DevCodeSnap is released under the [MIT License](LICENSE).
- **Public Availability:** The source code is maintained on GitHub and open for review, feedback, and contributions.

---

## Contributing

Contributions, feedback, and suggestions are welcome as DevCodeSnap evolves.

Detailed contribution guidelines and engineering conventions will be maintained in [CONTRIBUTING.md](CONTRIBUTING.md).

### Development Workflow

To maintain code stability and predictable quality, the project follows this workflow:

1. Active development takes place on the **`test`** branch.
2. Changes must pass static analysis (`npm run typecheck`, `npm run lint`, `npm run format:check`) and unit tests (`npm run test`).
3. Changes must be manually verified within Google Chrome before being marked ready.
4. Only stable, fully verified implementations are merged into **`main`**.

---

## Roadmap

The approved development roadmap outlines the planned evolution of DevCodeSnap:

| Phase | Milestone                          |   Status    | Description                                                                                              |
| :---: | ---------------------------------- | :---------: | -------------------------------------------------------------------------------------------------------- |
| **1** | **Project Foundation**             |  Completed  | Manifest V3 setup, Vite + CRX build tooling, Tailwind styling, and base popup/page scaffolds.            |
| **2** | **Database & Core Infrastructure** | In Progress | Dexie.js IndexedDB schema, repository patterns, migration lifecycle, and error handling.                 |
| **3** | **UI Foundation**                  |  Scheduled  | Complete component library, dark/light theme switching, and responsive layout shells.                    |
| **4** | **Snippet Management**             |  Scheduled  | CRUD operations for snippets, collections, tags, favorites, and metadata editing.                        |
| **5** | **Capture System**                 |  Scheduled  | Web selection capture, context menus, and automated code-block detection on web pages.                   |
| **6** | **Search & Filtering**             |  Scheduled  | Instant search, multi-criteria filtering by language, collection, tag, and date.                         |
| **7** | **Export, Backup & Restore**       |  Scheduled  | Export to source files, Markdown, JSON, ZIP archives, and full database backup/restore.                  |
| **8** | **QA & Polish**                    |  Scheduled  | Comprehensive test coverage, cross-page integration tests, performance tuning, and accessibility audits. |
| **9** | **Open-Source Release**            |  Scheduled  | Final release documentation, production packaging, and initial distribution.                             |

---

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for complete details.
