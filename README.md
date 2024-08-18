# Tolstoy Metadata Fetcher

A simple web application that allows users to input URLs and fetch metadata (title, description, and image) from each URL via an API endpoint.

## 🛠️ Tech Stack

- **Frontend**: Vite, React
- **Testing**: Vitest
- **Backend**: Node.js, Express

## ✨ Features

- **Form Functionality**: A user-friendly form where users can input multiple URLs. Upon submission, the app fetches metadata from the URLs via an API endpoint.
- **Security**:
  - **Anti-XSS**: Content-Security-Policy headers and input validation help prevent XSS attacks.
  - **URL Validation**: The backend validates URLs to ensure safe and secure metadata fetching.
- **Rate Limiting**: The server enforces a rate limit of 5 requests per second to prevent abuse.
- **Styling**: The CSS is kept simple for clarity, with a primary color palette inspired by Tolstoy's logo (pink/red).

## 🚀 Getting Started

### Cloning the Repository

```bash
git clone https://github.com/yourusername/tolstoy-assignment.git
cd tolstoy-assignment
```

# Installation

Root Directory:

```bash
npm install
```

Client Directory:

```bash
cd client
npm install
```

Server Directory:

```bash
cd server
npm install
```

# Running the Application

Server Directory:

```bash
npm run start
```

Client Directory:

```bash
npm run dev
```

# Running Tests

To run unit tests with a user interface, run this command in the Root Directory:

```bash
npm run test:ui
```

This command launches the Vitest testing UI, allowing you to run and inspect tests interactively.

🧪 Testing Strategy Basic tests were implemented to verify the core functionality of both the frontend and backend:

## Frontend Tests

Simple tests cover key UI elements and form interactions.

## Backend Tests

Basic tests ensure the API endpoints function correctly.

While these tests ensure basic functionality, there are many opportunities for more in-depth testing. In the interest of time, the current test suite is kept minimal.
