

💻 Development & Testing
------------------------

This section is for developers contributing to the library or running the demo application locally.

### 1\. Build the Library

You must build the library first because the test app consumes the built artifact (`dist/`).

```bash
# Build the library in production mode
npm run ng -- build ngx-config-orchestrator

```

### 2\. Run the Test App

The `demo-app` is a demo application included in the workspace to verify functionality.

```bash
# Serve the test application
npm run ng -- serve demo-app

```

- **URL:** `http://localhost:4200`

- **Verify:** Open the URL. You should see the configuration values displayed on the screen.

- **Hot Test:** Modify `projects/demo-app/src/assets/app-settings.manifest.json` while the server is running and refresh the browser to see changes instantly.

### 3\. Running Tests

To run unit tests for the library:

```bash
npm run ng -- test ngx-config-orchestrator

```

⚠️ Server-Side Rendering (SSR) Note
-----------------------------------

If you are using Angular Universal (SSR), the library is designed to handle it gracefully.

- **Server:** The HTTP request to fetch the manifest is **skipped** on the server to prevent `NetworkError` (since Node.js doesn't understand relative paths like `./assets`). It returns an empty object or your default `environment` values.

- **Browser:** The browser fetches the real JSON file during hydration, ensuring the client has the correct runtime configuration.

**License** MIT © Xhani Manolis Trungu
