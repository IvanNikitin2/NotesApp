# Desktop App (macOS)

This directory contains the source code for the macOS desktop application, built with React, TypeScript, and Tauri.

## Features

-   **Native macOS Window**: Runs as a standalone desktop application.
-   **Live Reload**: The app window automatically updates when you save changes to the React code.
-   **Modern Frontend**: Built with React, TypeScript, and Vite for a fast development experience.

## Prerequisites

Before you begin, ensure you have the following installed on your macOS machine:

1.  **Node.js and npm**: [Install Node.js](https://nodejs.org/) (which includes npm).
2.  **Rust and Cargo**: [Install Rust](https://www.rust-lang.org/tools/install).
3.  **Tauri Prerequisites**: Follow the official Tauri guide to set up your system for development. You will need to install Clang and other macOS dependencies.
    ```shell
    xcode-select --install
    ```

## Setup and Run Instructions

Follow these steps to set up and run the application in development mode with live reload.

### 1. Install Frontend Dependencies

Navigate to the frontend directory and install the required Node.js packages.

```shell
cd my-notes-app/desktop-app/frontend
npm install
```

### 2. Run the Development Server

This command starts the Tauri application in development mode. It will first start the Vite development server for the React frontend and then launch the native macOS window.

From the `my-notes-app/desktop-app` directory, run:

```shell
cd my-notes-app/desktop-app
npm install --save-dev @tauri-apps/cli
npm run tauri dev
```
- The first command (`npm install`) adds the Tauri CLI as a dev dependency to your project, allowing you to run Tauri commands.
- The second command (`npm run tauri dev`) will compile the Rust code and launch the app. A macOS window will open, displaying the React application.
- Any changes you make to the React code (e.g., editing `frontend/src/App.tsx`) will trigger an automatic reload in the app window.

## Build Instructions

To build a standalone `.app` bundle for macOS, run the following command from the `my-notes-app/desktop-app` directory:

```shell
npm run tauri build
```

The compiled application (`.app` and `.dmg` files) will be located in `my-notes-app/desktop-app/src-tauri/target/release/bundle/macos/`.