TDD Kata: Car Dealership Inventory System 

Objective 

The goal of this kata is to design, build, and test a full-stack Car Dealership Inventory System. This project will test your skills in API development, database management, frontend implementation, testing, and modern development workflows, including the use of AI tools. 

Core Requirements 

1. Backend API (RESTful) 

You are to build a robust backend API that will serve as the brain of the application. 

Technology: Choose one of the following: Node.js/TypeScript (with Express/NestJS), Python (with Django/FastAPI), Java (with Spring Boot), or Ruby (with Rails). 

Database: The application must connect to a database (e.g., PostgreSQL, MongoDB, SQLite). An in-memory database is not sufficient. 

User Authentication: 

Users must be able to register and log in. 

Implement token-based authentication (e.g., JWT) to secure certain API endpoints. 

API Endpoints: 

Auth: POST /api/auth/register, POST /api/auth/login 

Vehicles (Protected): 

POST /api/vehicles: Add a new vehicle. 

GET /api/vehicles: View a list of all available vehicles. 

GET /api/vehicles/search: Search for vehicles by make, model, category, or price range. 

PUT /api/vehicles/:id: Update a vehicle's details. 

DELETE /api/vehicles/:id: Delete a vehicle (Admin only). 

Inventory (Protected): 

POST /api/vehicles/:id/purchase: Purchase a vehicle, decreasing its quantity. 

POST /api/vehicles/:id/restock: Restock a vehicle, increasing its quantity (Admin only). 

Each vehicle must have a unique ID, make, model, category, price, and quantity in stock. 

2. Frontend Application 

You must build a modern, single-page application (SPA) to interact with your backend API. 

Technology: You must use a modern frontend framework like React, Vue, Angular, or Svelte. 

Functionality: 

User registration and login forms. 

A dashboard or homepage to display all available vehicles. 

Functionality to search and filter vehicles. 

A "Purchase" button on each vehicle, which should be disabled if the quantity is zero. 

(For Admin Users) Forms/UI to add, update, and delete vehicles. 

Design: This is a chance to show your creativity. The application should be visually appealing, responsive, and provide a great user experience. 

Process & Technical Guidelines 

first build backend if possible than frontend ,if require you can go with alongside whenever needed.

1. Test-Driven Development (TDD) 

Write tests before implementing functionality. We expect to see a clear "Red-Green-Refactor" pattern in your commit history, especially for the backend logic. Aim for high test coverage with meaningful test cases. 

2. Clean Coding Practices 

Write clean, readable, and maintainable code. Follow SOLID principles and other best practices in software design. Your code should be well-documented with meaningful comments and clear naming conventions. 

3. Git & Version Control 

Use Git for version control. Commit your changes frequently with clear, descriptive messages that narrate your development journey. 

4. AI Usage Policy (Important) 

We believe AI is a critical tool in the modern software development lifecycle. You are encouraged and expected to use AI tools. However, you must be transparent about it. 

AI Co-authorship: For every commit where you used an AI tool (for generating boilerplate, writing tests, debugging, etc.), you must add the AI as a co-author. 

How to add a co-author: At the end of your commit message, add two empty lines, followed by the co-author trailer. 

git commit -m "feat: Implement user registration endpoint 
 
Used an AI assistant to generate the initial boilerplate for the 
controller and service, then manually added validation logic. 
 
Co-authored-by: AI Tool Name <AI@users.noreply.github.com>" 

README Documentation: Your README.md file must include a detailed section titled "My AI Usage". In this section, you must describe: 

Which AI tools you used (e.g., GitHub Copilot, ChatGPT, Gemini, etc.). 

How you used them (e.g., "I used Gemini to brainstorm API endpoint structures," or "I asked Copilot to generate unit tests for my service layer"). 

Your reflection on how AI impacted your workflow. 

Interview Discussion: Be prepared to discuss your AI usage in detail during the interview. We are interested in how you leverage these tools effectively and responsibly. 

Deliverables 

A public Git repository link (e.g., on GitHub, GitLab). 

A comprehensive README.md file that includes: 

A clear explanation of the project. 

Detailed instructions on how to set up and run the project locally (both backend and frontend). 

Screenshots of your final application in action. 

The mandatory "My AI Usage" section. 

A test report showing the results of your test suite. 

(Optional - Brownie Points) A link to the deployed, live application on a platform like Vercel, Netlify, Heroku, or AWS. 

Note: Plagiarism is strictly forbidden. While we encourage AI assistance, submitting code copied from other repositories or developers will result in immediate rejection. We want to see your work, augmented by modern tools. 


---------------

springboot - 3.5.16
java - 17
so add dependency compatible with it.

GitHub repo:https://github.com/kantariya/car-dealership-inventory-system
branch - main

use feat: , fix: , chore: , docs: , test: , refactor: , style: , perf: , builds:, ci: etc. commit types in commiy message,


keep environment varibles and use them because we might want to deplye it on render on somewhere.

in red green refactor commit follow this:
              
[Oldest Commit]  🔴 test: add failing test for user registration (impotantlly only create commit at local dont push here)
		 🟢 feat: implement user registration logic to pass test (we can push here optionally if needed)
[Latest Commit]  🔵 refactor: clean up user registration query and variables(push after every refactor)

====================================================
Additional Development Instructions
====================================================

General Rules

- Read this entire instruction file before making any changes.
- If any requirement is unclear or conflicting, STOP and ask for clarification instead of guessing.
- Do not over-engineer the solution or implement future features.
- Implement only the feature I explicitly ask for.
- Keep code clean, readable and maintainable.
- Follow SOLID principles and clean architecture.
- Prefer composition over inheritance where appropriate.
- Prefer constructor injection over field injection.
- Keep controllers thin. Business logic belongs in services.
- Use meaningful variable, method and class names.
- Do not leave TODOs or placeholder implementations unless instructed.
- Do not generate unnecessary code.

====================================================
Architecture
====================================================

Use feature-based package structure.

Example:

auth/
    controller/
    service/
    repository/
    entity/
    dto/
    mapper/
    validator/
    exception/

vehicle/
inventory/
user/

Common reusable code should be placed inside common/, config/, security/, etc.

Do not create packages or classes for future features.

====================================================
Dependencies
====================================================

Spring Boot Version:
3.5.16

Java Version:
17

Only use dependencies compatible with these versions.

Do not introduce unnecessary dependencies.

Prefer official Spring Boot starters.

====================================================
Database
====================================================

Database:
PostgreSQL (Neon)

Use Spring Data JPA.

Use Flyway for database migrations.

Do NOT rely on ddl-auto=create or create-drop.

Use proper entity relationships.

Store all credentials using environment variables.

Never hardcode:

- database url
- usernames
- passwords
- JWT secrets
- frontend URLs

====================================================
Testing Rules (STRICT TDD)
====================================================

Follow Test Driven Development exactly.

NEVER write production code before the failing test exists.

Every feature must follow:

RED
- Write failing test.
- Verify test fails.

GREEN
- Write the minimum implementation required to pass.
- Do not over-implement.

REFACTOR
- Improve naming.
- Remove duplication.
- Improve readability.
- Ensure all tests still pass.

Only implement ONE small behaviour per TDD cycle.

Never combine multiple features into one cycle.

Stop after each completed Red-Green-Refactor cycle.

====================================================
Testing Framework
====================================================

Use:

- JUnit 5
- Mockito
- MockMvc
- Spring Security Test
- Testcontainers (where applicable)

Write meaningful assertions.

Use Arrange-Act-Assert structure.

Test names should clearly describe expected behaviour.


====================================================
Environment Variables
====================================================

Never hardcode secrets, credentials, API keys, database URLs, JWT secrets, or environment-specific values.

Always use environment variables.

If a required environment variable does not exist:

- Create or update `.env.example` with placeholder values only.
- Never create or commit a `.env` file.
- Use descriptive placeholder values such as:

DB_URL=your_database_url
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
JWT_SECRET=replace_with_secure_secret
VITE_API_BASE_URL=http://localhost:8080/api

If an actual secret or connection string is required to continue, stop and ask me to provide or replace the placeholder value instead of inventing one.

Code should fail fast with a clear error message when required environment variables are missing.

Never print, log, commit, or include secrets, passwords, API keys, tokens, or connection strings in source code, commit messages, documentation, screenshots, or generated files.

====================================================
Git Rules
====================================================

Use Conventional Commits.

Examples:

feat:
fix:
test:
refactor:
docs:
style:
perf:
build:
ci:
chore:

Commit frequently.

One logical change per commit.

Never squash TDD commits.

Never rewrite Git history unless instructed.

Never push automatically.

Create commits locally and stop.

Wait for my approval before pushing.

====================================================
Commit Structure
====================================================

Each feature should generally produce:

1.
test: add failing test ...

2.
feat: implement ...

3.
refactor: improve ...

Then STOP.

====================================================
AI Usage
====================================================

Whenever AI materially contributes to a commit, append the required co-author trailer exactly as required by the project instructions.

Do not falsely claim AI generated code that I wrote myself.

If I tell you I implemented something manually, do not include AI attribution for that commit.

Do not fabricate explanations inside commit messages.

====================================================
Frontend
====================================================

Frontend must only consume backend APIs.

Do not create frontend pages for features that do not yet exist in the backend.

Build the frontend incrementally.

Keep components reusable.

Avoid duplicate UI logic.

====================================================
Code Quality
====================================================

Prefer immutable DTOs where appropriate.

Use validation annotations.

Return proper HTTP status codes.

Use global exception handling.

Avoid duplicated code.

Avoid magic numbers and strings.

Write self-documenting code.

Keep methods small.

Keep classes focused on a single responsibility.

====================================================
Environment Variables
====================================================

Use environment variables for every configurable value.

Provide sensible defaults only where appropriate.

Never commit secrets.

====================================================
Workflow
====================================================

For every feature:

1. Understand the requirement.
2. Write failing tests.
3. Commit (test:)
4. Implement the minimum code.
5. Commit (feat:)
6. Refactor.
7. Commit (refactor:)
8. STOP and wait for further instructions.

====================================================
Important
====================================================

Quality is preferred over speed.

Correctness is preferred over completeness.

Never implement functionality that has not been requested.

When in doubt, stop and ask.


