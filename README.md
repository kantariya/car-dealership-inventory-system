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

---

## 🌟 Project Overview

**LuxeDrive** is a state-of-the-art, full-stack Car Dealership Inventory System. Built on modern development workflows, the application delivers a premium user experience combining a robust backend architecture with a highly-polished, media-integrated single-page application (SPA).

Featuring an dark luxury aesthetic, the system supports role-based access (Standard User and Admin), dynamic vehicle cataloging, inventory adjustment actions (purchasing and restocking), multi-parameter search/filters, and full-screen ambient video backgrounds with low-volume background audio for maximum sensory immersion.

### Key Features
* 🔒 **Role-Based Token Authentication**: Secure token-based registration & login featuring password validation and automatic route guards.
* 🚗 **Dynamic Showroom**: Responsive card layout displaying real-time stock levels, pricing, category badges, and quick actions.
* 🔍 **Advanced Search Specification**: Multi-criteria search capabilities on the backend (make, model, category, minimum/maximum price) integrated with a responsive slide-out filters panel on the frontend.
* 🛒 **Purchase Flow**: Real-time validation preventing purchase of out-of-stock items, immediately updating inventory quantities.
* 🛠️ **Admin Operations Hub**: Administrative dashboard allowing full CRUD operations (add, edit, update, delete) and instant stock replenishment.
* 🎵 **Ambient Media Integration**: Custom React wrappers for looping background video and subtle low-volume soundtrack control for custom luxury branding.

---

## 💻 Tech Stack

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://img.shields.io/badge/SPRING%20BOOT-3.5.16-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
      <br/><br/>
      <b>Backend Services</b>
      <hr/>
      <ul>
        <li>Java 17 &amp; Spring Boot Web</li>
        <li>Spring Security &amp; JWT</li>
        <li>Spring Data JPA</li>
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
      <ul>
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

The project is structured around a decoupled, feature-based package design for clean separation of concerns and maintainability.

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
* **Java Development Kit (JDK) 17** installed and configured in your path.
* **Node.js** (v18.x or above) & **npm** installed.
* **PostgreSQL Database** instance (local or hosted e.g. Neon DB).

---

### 1. Environment Configuration

Create a `.env` file in the project root containing your database credentials and JWT security properties:

```env
# Database Configuration
DB_URL=jdbc:postgresql://your_database_host:5432/dealership_db
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

# Security Configuration (Minimum 256-bit secret)
JWT_SECRET=your_super_secret_base64_encoded_key_containing_32_bytes_or_more

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8080/api
FRONTEND_URL=http://localhost:5173
```

> [!WARNING]
> Never commit your actual `.env` file to version control. The repository contains a placeholder `.env.example` file for template reference.

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

* The backend service will start on port `8080` (accessible at `http://localhost:8080`).
* Flyway migrations will run automatically on startup to initialize database tables:
  * `V1__init.sql` (baseline)
  * `V2__create_users_table.sql` (Creates users table with role support)
  * `V3__create_vehicles_table.sql` (Creates vehicles inventory table)

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
   Copy `.env.example` to `.env` inside the `frontend` directory:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

* The frontend application will be hosted locally at `http://localhost:5173`.
* You can access the dashboard, register standard or administrator accounts, and browse the inventory.

---

## 🧪 Test Suite & Coverage

The project enforces strict **Test-Driven Development (TDD)** practices. Features are introduced through a rigorous Red-Green-Refactor development cycle.

### Running Backend Tests
Navigate to `/backend` and execute:
```bash
./mvnw test
```

### Running Frontend Tests
Navigate to `/frontend` and execute:
```bash
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

*Placeholder section. Fill with your actual application screenshots after running locally.*

| Showroom Dashboard | Vehicle Detail & Filter Drawer | Admin Control panel |
| :---: | :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/600x400/0B0D17/F8FAFC?text=LuxeDrive+Showroom) | ![Filters Placeholder](https://via.placeholder.com/600x400/0B0D17/F8FAFC?text=Dynamic+Search+Filters) | ![Admin Dashboard Placeholder](https://via.placeholder.com/600x400/0B0D17/F8FAFC?text=Admin+CRUD+and+Restock) |

---

## 🌐 Live Deployment

*Placeholder section. Fill with your deployment links.*

* **Live Application URL**: [Visit LuxeDrive Web Client](https://example.com) (Deployed via Vercel)
* **API Documentation Server**: [LuxeDrive API Host](https://example.com/api) (Deployed via Render / AWS)

---

## 📝 My AI Usage

### AI Tools Used
* **Gemini 3.5 Flash** (via the Antigravity AI coding assistant framework) served as the primary pair-programming co-author.

### How AI was Used
* **TDD Loop Generation**: Assisted in drafting the initial failing test assertions for Spring Security rules, vehicle specification searches, and complex Material UI component triggers (like the admin restocking dialog modal).
* **Architecture Drafting**: Helped structure the feature-based modular layout (`auth/`, `vehicle/`, `security/`, `common/`) to align with clean design practices.
* **Component Design**: Streamlined the design of the premium Material UI 9 palette config, implementing custom glassmorphism styles (`rgba(19, 22, 41, 0.4)` background filters with blur) and Framer Motion hooks for transitions.
* **Rebranding Workflow**: Generated code structure and configurations for ambient background media handlers (`BackgroundVideo` and `BackgroundAudio`), adjusting vitest mocks to mock HTMLMediaElement features appropriately.

### Reflection
The collaboration with the AI assistant accelerated the workflow, particularly in maintaining strict compliance with the **Test-Driven Development (TDD)** lifecycle. When writing complex queries (such as building JPA dynamic specifications on the fly), the AI proposed type-safe Spring Data configurations that passed verification instantly. On the frontend, mocking browser behaviors (such as HTML5 audio playback restrictions) in vitest was completed smoothly, preventing unnecessary test setup delays. Overall, the AI acted as a valuable assistant, converting abstract design goals into verified, clean code implementations.

---
*Co-authored-by: Gemini 3.5 <gemini@users.noreply.github.com>*
