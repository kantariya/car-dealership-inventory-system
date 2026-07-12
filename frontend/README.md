# LuxeDrive - Premium Car Dealership & Inventory System

<p align="center">
  <svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; max-width: 800px; height: auto;">
    <defs>
      <!-- Gradients -->
      <linearGradient id="bluePurple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6"/>
        <stop offset="100%" stop-color="#8B5CF6"/>
      </linearGradient>
      <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#60A5FA"/>
        <stop offset="50%" stop-color="#A78BFA"/>
        <stop offset="100%" stop-color="#60A5FA"/>
      </linearGradient>
      <!-- Glow Filter -->
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Background Frame -->
    <rect width="100%" height="100%" rx="16" fill="#0B0D17"/>

    <!-- Decorative Tech-grid Lines -->
    <line x1="0" y1="180" x2="800" y2="180" stroke="rgba(248, 250, 252, 0.05)" stroke-width="2"/>
    <path d="M50 20 L750 20 C770 20, 780 30, 780 50 L780 150 C780 170, 770 180, 750 180 L50 180 C30 180, 20 170, 20 150 L20 50 C20 30, 30 20, 50 20 Z" fill="none" stroke="url(#bluePurple)" stroke-dasharray="1000" stroke-dashoffset="0" stroke-width="1.5">
      <animate attributeName="stroke-dashoffset" values="1000;0" dur="3s" repeatCount="1" fill="freeze"/>
    </path>

    <!-- Rotating Glow Ring -->
    <circle cx="120" cy="100" r="45" fill="none" stroke="url(#bluePurple)" stroke-width="3" filter="url(#glow)">
      <animateTransform attributeName="transform" type="rotate" from="0 120 100" to="360 120 100" dur="10s" repeatCount="indefinite"/>
    </circle>

    <!-- Sleek Car Silhouette -->
    <path d="M95 105 C95 100 102 95 110 93 L122 83 C125 80 128 80 132 83 L142 93 C145 94 148 97 148 100 L150 106 C150 108 147 110 144 110 L96 110 C93 110 90 108 90 106 Z" fill="url(#bluePurple)"/>
    <circle cx="108" cy="112" r="6" fill="#0B0D17" stroke="#3B82F6" stroke-width="2"/>
    <circle cx="138" cy="112" r="6" fill="#0B0D17" stroke="#8B5CF6" stroke-width="2"/>

    <!-- Title Text with neon pulse -->
    <text x="200" y="95" font-family="'Outfit', 'Inter', sans-serif" font-weight="900" font-size="42" fill="url(#neonGlow)" filter="url(#glow)" letter-spacing="3">
      LUXEDRIVE
      <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
    </text>

    <!-- Styled Subtitle -->
    <text x="202" y="130" font-family="'Inter', sans-serif" font-weight="500" font-size="16" fill="rgba(248, 250, 252, 0.6)" letter-spacing="1">
      Premium Car Dealership &amp; Inventory Management System
    </text>
  </svg>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Build Passing"/>
  <img src="https://img.shields.io/badge/backend%20tests-62%2F62-brightgreen?style=flat-square" alt="Backend Tests"/>
  <img src="https://img.shields.io/badge/frontend%20tests-47%2F47-brightgreen?style=flat-square" alt="Frontend Tests"/>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"/>
</p>

---

## 🌟 Project Overview

**LuxeDrive** is a full-stack car dealership inventory system built with a test-driven development workflow. It pairs a Spring Boot / PostgreSQL backend with a polished, media-rich React single-page application (SPA).

The app features a dark luxury aesthetic, role-based access (Standard User and Admin), dynamic vehicle cataloging, inventory adjustment actions (purchasing and restocking), multi-parameter search and filtering, and a full-screen ambient video background with low-volume audio for an immersive showroom feel.

### Key Features
* 🔒 **Role-Based Token Authentication** — Secure token-based registration and login with password validation and automatic route guards.
* 🚗 **Dynamic Showroom** — Responsive card layout displaying real-time stock levels, pricing, category badges, and quick actions.
* 🔍 **Advanced Search** — Multi-criteria search on the backend (make, model, category, min/max price) paired with a responsive slide-out filters panel on the frontend.
* 🛒 **Purchase Flow** — Real-time validation preventing purchase of out-of-stock items, with immediate inventory updates.
* 🛠️ **Admin Operations Hub** — Full CRUD (add, edit, update, delete) plus one-click stock replenishment.
* 🎵 **Ambient Media Integration** — Custom React components for looping background video and subtle, low-volume soundtrack playback.

---

## 💻 Tech Stack

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://img.shields.io/badge/SPRING%20BOOT-3.5.16-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
      <br/><br/>
      <b>Backend Services</b>
      <hr/>
      <ul align="left">
        <li>Java 17 &amp; Spring Boot Web</li>
        <li>Spring Security &amp; JWT (JJWT 0.12)</li>
        <li>Spring Data JPA &amp; Specifications</li>
        <li>PostgreSQL Database (Neon)</li>
        <li>Flyway Database Migrations</li>
        <li>JUnit 5 &amp; Mockito Testing</li>
      </ul>
    </td>
    <td align="center" width="50%">
      <img src="https://img.shields.io/badge/REACT-19.2.7-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
      <br/><br/>
      <b>Frontend Client</b>
      <hr/>
      <ul align="left">
        <li>React 19 &amp; Vite 8</li>
        <li>Material UI (MUI) v9</li>
        <li>Framer Motion Animations</li>
        <li>React Router Dom v7</li>
        <li>Axios HTTP Client</li>
        <li>Vitest &amp; Testing Library</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏗️ System Architecture

The project uses a decoupled, feature-based package design for clean separation of concerns and maintainability.

```mermaid
graph TD
    subgraph Frontend Client (React 19)
        AppRouter[AppRouter] --> ProtectedRoute[ProtectedRoute]
        ProtectedRoute --> AdminPage[AdminVehiclesPage]
        AppRouter --> Dashboard[DashboardPage]
        AppRouter --> VehiclesPage[VehiclesPage]
        AuthCtx[AuthContext] -. Provides Auth State .-> AppRouter
        AxiosClient[Axios Client] -. Calls REST APIs .-> AuthCtx
    end

    subgraph Backend Server (Spring Boot 3.5.16)
        JwtFilter[JwtAuthenticationFilter] --> SecurityConfig[SecurityConfig]
        SecurityConfig --> Controller[REST Controller]
        Controller --> Service[Service Implementations]
        Service --> Specification[JPA Specifications]
        Service --> Repository[JPA Repositories]
    end

    subgraph Database Layer
        Repository --> Postgres[(PostgreSQL Database)]
        Flyway[Flyway Migrations] -. Schema Migrations .-> Postgres
    end

    AxiosClient ====>|JSON over HTTP| JwtFilter
```

---

## ⚙️ Local Setup & Installation

### Prerequisites
* **Java Development Kit (JDK) 17**, installed and configured in your PATH.
* **Node.js** (v18.x or above) & **npm**.
* **PostgreSQL** instance (local or hosted, e.g. Neon).

---

### 1. Environment Configuration

Create a `.env` file in the project root with your database credentials and JWT security properties:

```env
# Database Configuration
DB_URL=jdbc:postgresql://your_database_host:5432/dealership_db
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

# Security Configuration (minimum 256-bit secret)
JWT_SECRET=your_super_secret_base64_encoded_key_containing_32_bytes_or_more

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8080/api
FRONTEND_URL=http://localhost:5173
```

> [!WARNING]
> Never commit your actual `.env` file to version control. The repository includes a placeholder `.env.example` for reference.

---

### 2. Backend Setup & Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project and download all Maven dependencies:
   ```bash
   ./mvnw clean install
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

* The backend service starts on port `8080` (`http://localhost:8080`).
* Flyway migrations run automatically on startup to initialize database tables:
  * `V1__init.sql` (baseline)
  * `V2__create_users_table.sql` (users table with role support)
  * `V3__create_vehicles_table.sql` (vehicle inventory table)

---

### 3. Frontend Setup & Run

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Set up the local environment file:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

* The frontend is hosted locally at `http://localhost:5173`.
* Register a standard or administrator account and browse the inventory.

---

## 🧪 Test Suite & Coverage

The project follows a strict **Test-Driven Development (TDD)** workflow — every feature was introduced through a Red → Green → Refactor cycle, with failing tests committed before implementation.

### Running Backend Tests
```bash
cd backend
./mvnw test
```

### Running Frontend Tests
```bash
cd frontend
npm run test:run
```

### Test Report

```
================================================================================
                                 TEST RESULTS SUMMARY
================================================================================
Backend (JUnit 5 & Mockito):
  ✔ Active Test Suites: 8
  ✔ Passing Test Assertions: 62 / 62
  ✔ Failed / Skipped Tests: 0
  ✔ Components covered: AuthController, VehicleController, JwtService,
                        SecurityConfig, GlobalExceptionHandler, Service Layers.

Frontend (Vitest & Testing Library):
  ✔ Active Test Files: 11
  ✔ Passing Test Assertions: 47 / 47
  ✔ Failed / Skipped Tests: 0
  ✔ Components covered: AppRouter, AuthContext, MainLayout, DashboardPage,
                        VehiclesPage, RegisterPage, LoginPage, AdminVehiclesPage,
                        BackgroundVideo, BackgroundAudio, ProtectedRoute.
================================================================================
```

<details>
<summary>🔍 Detailed Test Execution Breakdown</summary>

#### Backend Test Logs
```
[INFO] Running com.kishan.backend.BackendApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.kishan.backend.auth.controller.AuthControllerTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.kishan.backend.auth.service.AuthServiceImplTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.kishan.backend.common.exception.GlobalExceptionHandlerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.kishan.backend.security.JwtServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.kishan.backend.security.SecurityConfigTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.kishan.backend.vehicle.controller.VehicleControllerTest
[INFO] Tests run: 26, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.kishan.backend.vehicle.service.VehicleServiceImplTest
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0
[INFO] Results: Tests run: 62, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

#### Frontend Test Logs
```
✓ src/routes/__tests__/AppRouter.test.jsx (6 tests)
    ✓ should render DashboardPage for /dashboard route when authenticated
    ✓ should deny access to admin route when authenticated as standard user
✓ src/layouts/__tests__/MainLayout.test.jsx (3 tests)
    ✓ should render application branding and children content
    ✓ should show admin navigation links only to admin users
    ✓ should call logout function when clicking logout button
✓ src/pages/__tests__/DashboardPage.test.jsx (6 tests)
    ✓ should render loading skeleton or spinner initially
    ✓ should fetch and display all available vehicles
    ✓ should enable purchase button when quantity > 0 and call purchase API on click
    ✓ should show error notification if purchase fails
✓ src/context/__tests__/AuthContext.test.jsx (7 tests)
✓ src/components/common/__tests__/BackgroundAudio.test.jsx (2 tests)
✓ src/routes/__tests__/ProtectedRoute.test.jsx (2 tests)
✓ src/pages/__tests__/LoginPage.test.jsx (4 tests)
    ✓ should render login form with email and password fields
    ✓ should submit the form and navigate on success
✓ src/components/common/__tests__/BackgroundVideo.test.jsx (2 tests)
✓ src/pages/__tests__/VehiclesPage.test.jsx (5 tests)
    ✓ should filter vehicles by criteria when search button is clicked
✓ src/pages/admin/__tests__/AdminVehiclesPage.test.jsx (5 tests)
    ✓ should open Add/Edit Vehicle modals and perform CRUD operations
    ✓ should open Restock Dialog and trigger increase stock
✓ src/pages/__tests__/RegisterPage.test.jsx (5 tests)

Test Files  11 passed (11)
     Tests  47 passed (47)
  Duration  25.10s
```
</details>

---

## 📷 Screenshots in Action

*Placeholder section — replace with actual application screenshots after running locally.*

| Showroom Dashboard | Vehicle Detail & Filter Drawer | Admin Control Panel |
| :---: | :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/600x400/0B0D17/F8FAFC?text=LuxeDrive+Showroom) | ![Filters Placeholder](https://via.placeholder.com/600x400/0B0D17/F8FAFC?text=Dynamic+Search+Filters) | ![Admin Dashboard Placeholder](https://via.placeholder.com/600x400/0B0D17/F8FAFC?text=Admin+CRUD+and+Restock) |

---

## 🌐 Live Deployment

*Placeholder section — replace with your deployment links.*

* **Live Application URL**: [Visit LuxeDrive Web Client](https://example.com) (Deployed via Vercel)
* **API Documentation Server**: [LuxeDrive API Host](https://example.com/api) (Deployed via Render / AWS)

---

## 📝 My AI Usage

This project was built solo using an AI-assisted, strict TDD workflow. AI tools acted as a pair-programmer for nearly every commit (51 of 54 commits in the project history are AI co-authored), but every line was reviewed, run, and understood before being committed. Below is a full, honest breakdown of what was used and how.

### AI Tools Used
* **Antigravity** (Google's agentic AI coding assistant, powered by Gemini) — the primary pair-programming tool used throughout backend and frontend development, appearing as `Co-authored-by: Antigravity` across the vast majority of commits.
* **Gemini 3.5 Flash** — used specifically for drafting this README (SVG header, architecture diagram, setup docs, and test report formatting).

### How AI Was Used

**1. Enforcing the Red → Green → Refactor TDD cycle**
Almost every feature in this repo followed a 3-commit pattern, and AI assisted at each stage:
* *RED* — AI helped draft the initial failing unit/integration tests (e.g. `AuthControllerTest`, `VehicleServiceImplTest`, `AppRouter` tests, `AdminVehiclesPage` CRUD tests) before any implementation existed.
* *GREEN* — AI helped write the minimum implementation code needed to make those tests pass (e.g. `AuthServiceImpl` registration/login logic, JWT generation via `JwtService`, vehicle purchase/restock endpoints, `DashboardPage` and `VehiclesPage` components).
* *REFACTOR* — AI assisted in cleaning up passing code, such as extracting helper methods (`findVehicleById`, `buildSearchSpecification`, `mapToResponse`, `validateInStock`) and simplifying Spring Security/JWT configuration.

**2. Backend (Spring Boot) development**
* Spring Security & JWT authentication filter setup, including stateless session policy and role-based endpoint protection.
* Vehicle domain logic: creation, search (via JPA Specifications), update, deletion, purchase (with out-of-stock handling), and restocking, each backed by full unit and integration test coverage.
* Global exception handling (`GlobalExceptionHandler`) mapping custom exceptions to correct HTTP status codes (400, 401, 403, 404).
* PostgreSQL/Flyway configuration and environment-based Spring profiles (dev, prod, local).
* CORS configuration for local frontend integration.

**3. Frontend (React) development**
* Project scaffolding: Vite config, dependency selection (MUI, Framer Motion, Axios, React Router), and the Axios instance with a JWT interceptor and 401 auto-redirect.
* `AuthContext`/`AuthProvider`, `ProtectedRoute`, `LoginPage`, and `RegisterPage`, including form validation and error handling.
* `DashboardPage`, `VehiclesPage` (search/filter panel), and `AdminVehiclesPage` (full CRUD + restock dialogs), plus the reusable `VehicleCard` component.
* Fixing recurring test issues surfaced during development, such as EMFILE errors from shallow MUI icon imports (resolved with deep imports), React 19 `act()` warnings, and `useMediaQuery`/`ThemeProvider` test wrapping.

**4. Rebranding & ambient media integration**
* Built the `BackgroundVideo` and `BackgroundAudio` components (autoplay/loop/muted video background, low-volume audio triggered on first interaction), including their test suites and global Vitest mocks to avoid JSDOM memory issues.
* Renamed the project from an earlier working name ("AutoVault") to **LuxeDrive** across pages, layouts, and tests, and applied the glassmorphism visual overhaul (backdrop-filter blur, translucent MUI overrides) to showcase the new background media.
* Diagnosed and fixed flaky tests introduced by the media components — e.g. asserting on the `element.muted` DOM property instead of the attribute (since React binds `muted` as a property, not an attribute), and increasing timeouts on slower CI/VM test runs.

**5. Documentation**
* Gemini 3.5 Flash drafted this README: the animated SVG header/badges, the Mermaid architecture diagram, the setup instructions, and the formatted test coverage reports.

### What I Did Myself
* Reviewed, ran, and understood every AI-suggested change before committing it — no code was merged without being verified against the test suite.
* Made all product and architecture decisions (feature scope, role-based access model, package structure, styling direction, rebrand to LuxeDrive).
* Debugged failing/flaky tests and decided on the actual fixes to apply (AI proposed candidate fixes; I chose and validated the correct one in context).
* Wrote and curated commit messages, and structured the overall TDD workflow that AI was directed to follow at each step.

### Reflection
Using AI as a consistent pair-programmer sped up the mechanical parts of TDD — scaffolding failing tests, wiring up boilerplate Spring Security config, and mocking browser media APIs in Vitest — while I stayed responsible for design decisions, debugging judgment calls, and final review. The most valuable use was in JPA Specification-based dynamic search queries and HTML5 media mocking, both of which are easy to get subtly wrong by hand. The biggest risk of leaning on AI this heavily is losing track of *why* a fix works; I mitigated that by keeping every change scoped to a single failing test and confirming the suite was green before moving on.

---
