 
# Smart Job Application System

An AI-powered recruitment platform designed to simplify and optimize the hiring process through intelligent CV analysis, candidate evaluation, and application management.

## About the Project

Smart Job Application System is a web-based recruitment platform that connects candidates, recruiters (HR), and administrators.

The platform integrates Artificial Intelligence to assist recruiters in analyzing CVs, identifying relevant skills, and evaluating candidate profiles. AI provides recommendations to support recruitment decisions without replacing human judgment.

## Key Features

- **Authentication & Authorization:** Secure authentication using JWT and role-based access control.
- **Candidate Management:** Candidate profiles and CV uploads.
- **Job Management:** Create, update, and manage job offers.
- **Application Management:** Submit and track job applications.
- **AI-Powered CV Analysis:** Extract and analyze candidate skills and information.
- **Candidate Evaluation:** AI-assisted matching scores, feedback, and missing skills.
- **Recruitment Dashboard:** Manage candidates and applications.

## Technologies Used

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA / Hibernate
- REST API
- JWT Authentication

### Frontend
- Angular
- TypeScript
- HTML5 / CSS3

### Database
- PostgreSQL

### Artificial Intelligence
- Ollama
- Llama 3.1

### DevOps & Tools
- Git & GitHub
- Swagger / OpenAPI

## Architecture

The application follows a layered architecture:

- **Controller Layer:** Handles HTTP requests and API endpoints.
- **Service Layer:** Implements business logic.
- **Repository Layer:** Manages database operations.
- **Security Layer:** Handles authentication and authorization.
- **AI Integration:** Provides intelligent CV analysis and candidate evaluation.

## User Roles

- **Candidate:** Creates a profile, uploads a CV, browses job offers, and submits applications.
- **HR / Recruiter:** Publishes job offers, manages applications, and reviews AI-assisted candidate evaluations.
- **Administrator:** Manages users and platform administration.

## Installation and Setup

### Prerequisites
- Java 17
- Maven
- Node.js and npm
- PostgreSQL
- Docker (optional)
- Ollama (for local AI integration)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the backend directory:

   ```bash
   cd smart-job-application-system-back
   ```

3. Configure your PostgreSQL database and application properties.

4. Run the backend:

   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd smart-job-application-system-front
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Angular application:

   ```bash
   ng serve
   ```

The application will be available at `http://localhost:8080`.

## API Documentation

Swagger UI is available when the backend is running:

`http://localhost:8080/swagger-ui/index.html`

## Project Status

This project was developed as part of an engineering internship at Axia Solutions, focusing on full-stack development, Artificial Intelligence integration, and DevOps practices.

## Author

**Rihem Mnajja**

Engineering Student in Telecommunications and Computer Networks

"# SmartJob" 
