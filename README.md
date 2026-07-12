# Car Dealership Inventory System

A full-stack inventory management system for a car dealership. Built with Spring Boot 4.1.0 on the backend and React 19 on the frontend. This was my submission for the Incubyte TDD Kata — I followed strict Test-Driven Development throughout the project.

## Features

- **JWT Authentication** — Register, login, and role-based access (Admin/User)
- **Vehicle Inventory** — Browse all vehicles with a clean card-based layout
- **Search & Filter** — Find vehicles by make, model, or category with partial matching
- **Purchase Flow** — Buy vehicles with instant quantity updates
- **Admin Panel** — Full CRUD operations plus restock functionality
- **Responsive Design** — Works on mobile, tablet, and desktop with a blue-themed UI

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 4.1.0, Spring Data JPA, Spring Security |
| Database | PostgreSQL (runtime), H2 (tests) |
| Auth | JWT via jjwt 0.13.0 |
| Frontend | React 19, Vite 8, Tailwind CSS v4, shadcn/ui |
| Backend Testing | JUnit 5, Mockito, MockMvc, AssertJ, @DataJpaTest, @WebMvcTest |
| Frontend Testing | Vitest, @testing-library/react, @testing-library/user-event |
| Build | Maven (backend), npm (frontend) |
| CI | GitHub Actions (backend + frontend on push) |

## Project Structure

```
backend/
├── pom.xml
├── src/main/java/com/dealershipinventory/backend/
│   ├── BackendApplication.java
│   ├── auth/           — User entity, JWT service, auth controller/DTOs
│   ├── config/         — Security config, JWT filter, DataSeeder
│   ├── vehicle/        — Vehicle entity, service, controller, specs, DTOs
│   └── exception/      — Global exception handler & custom exceptions
└── src/test/java/
    └── ...             — 45 tests (repository, service, controller)

frontend/
├── package.json
└── src/
    ├── api/            — Axios instance with JWT interceptor, API modules
    ├── components/     — Navbar, VehicleCard, SearchBar, route guards
    ├── context/        — AuthContext for user state management
    ├── hooks/          — useAuth, useVehicles
    ├── pages/          — Login, Register, Dashboard, Admin
    └── lib/            — cn() utility, shadcn/ui components
```

## Setup & Running

### Prerequisites

- JDK 21+
- Node.js 22+
- PostgreSQL 16+

### Backend

```bash
# Create the database
createdb car_dealership_inventory

# Update credentials in backend/src/main/resources/application.properties
# then run:
cd backend
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. On first run, it seeds an admin user and sample vehicles automatically.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### Default Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | admin123 |
| User | Register via /register | — |

## Screenshots

![Login Page](screenshots/Screenshot%202026-07-12%20204141.png)
![Dashboard](screenshots/Screenshot%202026-07-12%20204234.png)
![Admin Panel](screenshots/Screenshot%202026-07-12%20204251.png)

## API Endpoints

All `/api/vehicles/**` endpoints require a valid JWT in the `Authorization` header.

### Auth (public)

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/auth/register` | `{ email, password }` | `{ token, email, role }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, email, role }` |

### Vehicles (authenticated)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/vehicles` | All | List all vehicles |
| GET | `/api/vehicles/search?make=&model=&category=` | All | Partial, case-insensitive search |
| POST | `/api/vehicles` | All | Add a vehicle |
| PUT | `/api/vehicles/{id}` | All | Update a vehicle |
| DELETE | `/api/vehicles/{id}` | Admin | Delete a vehicle |
| POST | `/api/vehicles/{id}/purchase` | All | Purchase (decrements quantity) |
| POST | `/api/vehicles/{id}/restock` | Admin | Restock (increments quantity) |

All errors return a consistent JSON structure with timestamp, status, message, and details.

## Test Results

### Backend (45/45 passing)

```
Tests run: 4   — UserRepositoryTest (data integrity, queries)
Tests run: 4   — JwtServiceTest (token generation, validation)
Tests run: 4   — AuthServiceTest (register, login, edge cases)
Tests run: 4   — AuthControllerTest (HTTP status, validation)
Tests run: 4   — VehicleRepositoryTest (CRUD, specification search)
Tests run: 13  — VehicleServiceTest (all operations, stock validation)
Tests run: 12  — VehicleControllerTest (auth, roles, status codes)
```

### Frontend (28/28 passing)

```
AuthContext    — 4 tests (login, register, logout, state)
LoginPage      — 3 tests (render, error display, form submission)
RegisterPage   — 4 tests (validation, password match, error display)
ProtectedRoute — 2 tests (redirect with/without token)
App            — 1 test (route rendering)
Navbar         — 4 tests (user info, badges, logout)
VehicleCard    — 3 tests (display, stock states, purchase action)
SearchBar      — 3 tests (inputs, search call, clear)
DashboardPage  — 1 test (vehicle grid + loading)
AdminPage      — 2 tests (table, add dialog)
vehicleApi     — 1 test (API method structure)
```

## My AI Usage

I used **opencode** (an AI coding assistant by anomalyco) throughout this project.

### How I used it

- **Project scaffolding**: I had opencode generate the initial Spring Boot project structure and the Vite + React setup, which saved time on boilerplate configuration.
- **Test generation**: For most backend features, I asked opencode to write the test first (Red phase). I'd review the test, adjust it if needed, then let it generate the implementation code (Green phase). This kept the TDD cycle tight.
- **Frontend components**: The React components and pages were built iteratively — I'd describe what I needed, opencode would create the component, I'd run the tests, and we'd fix things together. The shadcn/ui integration and Tailwind configuration were largely AI-assisted.
- **Debugging**: When search wasn't returning results, I used opencode to trace through the request flow from the frontend API call through to the JPA specification. It identified the `@RequestParam` name resolution issue that I'd missed.
- **Commit management**: opencode helped maintain the commit narrative with proper conventional commit messages and co-author tags.

### Reflection

The biggest difference AI made was speed. Writing tests, entities, and CRUD endpoints manually would have taken significantly longer — opencode handled the repetitive parts so I could focus on the architecture and business logic. The TDD workflow actually worked better with AI assistance because the Red-Green-Refactor cycle gave clear boundaries for what to ask for next.

That said, I reviewed the code before committing. The AI sometimes generated overly generic solutions or missed edge cases, which is why having the tests in place was so important. The tests acted as my safety net — if the AI generated something wrong, the tests caught it.