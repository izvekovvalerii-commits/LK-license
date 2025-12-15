# Licensing Portal

Web portal for managing alcohol and tobacco licensing applications.

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite
- Ant Design
- React Router v6
- Axios

### Backend
- Spring Boot 3.2
- Java 17
- PostgreSQL 15
- Spring Security + JWT
- JPA/Hibernate

## Project Structure

```
licensing-portal/
├── frontend/          # React frontend (port 5174)
├── backend/           # Spring Boot backend (port 8081)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- PostgreSQL 15+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5174

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Backend API will be available at: http://localhost:8081

### Database Setup

Create PostgreSQL database:
```sql
CREATE DATABASE licensing_portal;
```

Update `backend/src/main/resources/application.yml` with your database credentials.

## Features

- **Authentication**: JWT-based authentication
- **Task Management**: Create and manage license applications (alcohol/tobacco)
- **Document Management**: Upload and organize required documents
- **Payment Tracking**: Track state fee payments
- **Reference Books**: Manage stores and employees
- **Deadline Tracking**: Notifications for upcoming deadlines

## API Documentation

API endpoints will be available at: http://localhost:8081/swagger-ui.html (when Swagger is configured)

## Development

### Frontend Development
- Source code: `frontend/src/`
- Components: `frontend/src/components/`
- Pages: `frontend/src/pages/`

### Backend Development
- Source code: `backend/src/main/java/com/licensing/portal/`
- Controllers: REST API endpoints
- Services: Business logic
- Repositories: Data access layer
- Models: Entity classes

## License

Proprietary
