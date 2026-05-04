
A application for managing and exporting image assets for web projects, built with a high-performance Rust backend and a modern React frontend.

## 🚀 Features

- **Project Management**: Create and organize multiple asset export projects.
- **Image Editor**: Integrated cropping and resizing tools for individual assets.
- **Dynamic Grid**: Efficiently browse and manage large collections of images using virtualized grids.
- **High Performance**: Rust-powered image processing and metadata management using the Axum framework.
- **SQLite Storage**: Persistent project and image data using SQLx.

## 🛠 Tech Stack

### Backend
- **Rust**: Language of choice for performance and safety.
- **Axum**: Ergonomic and modular web framework.
- **SQLx**: Async, type-safe SQLite interaction.
- **Image**: Robust image processing library.
- **Tokio**: Industry-standard async runtime.
- **Clap**: CLI argument parsing for headless operation.

### Frontend
- **React 19**: Modern UI library with the latest features.
- **Vite 6**: Blazing fast build tool and dev server.
- **Tailwind CSS 4**: Utility-first styling with high performance.
- **Zustand**: Lightweight state management.
- **Framer Motion**: Smooth animations and transitions.
- **dnd-kit**: Flexible drag-and-drop primitives.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust & Cargo](https://rustup.rs/) (Stable, Edition 2024)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## 🏃 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd asset.export
    ```

2.  **Install dependencies**:
    This will install both frontend and backend dependencies using the root workspace configuration.
    ```bash
    npm run install:all
    ```

3.  **Environment Setup**:
    Create a `.env.local` file in the `frontend` directory based on `frontend/.env.example`:
    ```bash
    cp frontend/.env.example frontend/.env.local
    ```
    *(Note: The `GEMINI_API_KEY` is required for AI-assisted features.)*

4.  **Run the application**:
    This command starts both the Rust backend and the Vite frontend concurrently.
    ```bash
    npm run dev
    ```
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend API**: [http://localhost:3001](http://localhost:3001) (Proxied via `/api` in development)

## 📁 Project Structure

```
.
├── backend/            # Rust Axum backend
│   ├── src/
│   │   ├── api.rs      # API endpoints (Projects, Export, Browse)
│   │   ├── db.rs       # Database logic & SQLite initialization
│   │   ├── main.rs     # Application entry point & CLI mode
│   │   ├── models.rs   # Shared data structures
│   │   └── processor.rs # Image processing logic
│   └── Cargo.toml
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/ # UI components (Editor, Grid, Sidebar)
│   │   ├── services/   # API client services
│   │   ├── store/      # Zustand state management
│   │   └── types/      # TypeScript definitions
│   └── package.json
├── package.json        # Root workspace & orchestration scripts
└── README.md           # This file
```

## 🖥️ CLI Mode

The backend can also be run in CLI mode for headless image processing:
```bash
cd backend
cargo run -- --run path/to/payload.json
```

---
*Built with ❤️ using Rust and React.*
