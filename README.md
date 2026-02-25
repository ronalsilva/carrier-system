# Clients Microservice - Ilia Wallet

Client management microservice developed for the platform that connects with the Wallet service. RESTful API built with Fastify, TypeScript and Prisma, offering complete CRUD operations for users and authentication via JWT.

## Technologies

- **Runtime**: Node.js
- **Framework**: Fastify
- **Language**: TypeScript
- **Messaging**: Kafka (KafkaJS)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker

## Features

- ✅ Complete user CRUD
- ✅ Authentication and authorization via JWT
- ✅ Interactive documentation with Swagger UI
- ✅ Schema validation with Fastify
- ✅ CORS configured
- ✅ Modular and scalable structure
- ✅ Automated tests with coverage

## Prerequisites

Before starting, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli) (installed via npm)

## Installation

1. **Clone the repository** (if you haven't already):
```bash
git clone <repository-url>
cd clients-microservice
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL="postgresql://postgres:admin@localhost:5431/clients-db-ilia"
JWT_SECRET = "ILIACHALLENGE_INTERNAL "
PORT= 3002
KAFKA_BROKERS=localhost:9092
KAFKA_REQUEST_TOPIC=client-microservice-requests
KAFKA_RESPONSE_TOPIC=client-microservice-responses
```

## Kafka Integration

The client-microservice communicates with other services via Kafka using the following topics:

- Consumption: `client-microservice-requests`
- Publication: `client-microservice-responses`

### Supported Actions
- `validateTokenAndGetUser`: validates the JWT token and returns the user data from the token.
- `getUserById`: searches for the user by the provided `userId` (token optional).

### Message Format

Request (validateTokenAndGetUser):
```json
{
  "correlationId": "request-uuid",
  "action": "validateTokenAndGetUser",
  "token": "jwt-token"
}
```

Request (getUserById):
```json
{
  "correlationId": "request-uuid",
  "action": "getUserById",
  "userId": "user-id",
  "token": "jwt-token (optional)"
}
```

Success response:
```json
{
  "correlationId": "request-uuid",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

Error response:
```json
{
  "correlationId": "request-uuid",
  "error": "Invalid token",
  "message": "Token expired or invalid"
}
```

4. **Start the database with Docker**:

Docker Compose is already configured.

```bash
docker-compose up -d
```

5. **Configure the database with Prisma**:
```bash
npx prisma db push
npx prisma generate
```

Or use the npm script:
```bash
npm run db
```

## Running the Project

### Development Mode
```bash
npm run dev
```

Or:
F5

The server will be available at `http://localhost:3002`

### Production Mode
```bash
npm run build
npm run start
```

## API Documentation

After starting the server, access the documentation in Swagger:

**http://localhost:3002/docs**

The documentation includes:
- All available endpoints
- Request and response schemas
- Usage examples
- JWT authentication

## Testing

Run tests with coverage:
```bash
npm run test
```
### CI/CD

The project is configured with **GitHub Actions** to automatically run unit tests on each push and pull request. The workflow runs tests with coverage and ensures the code is working correctly before being merged.

## Project Structure

```
clients-microservice/
├── src/
│   ├── api/              # Route definitions
│   ├── controllers/      # Control logic
│   ├── middleware/       
│   │   └── Kafka         # Kafka configuration
│   ├── schemas/          # Validation schemas
│   ├── service/          # Business logic
│   ├── utils/            # Utilities
│   ├── test/             # Tests
│   ├── app.ts            # Entry point
│   └── server.ts         # Server configuration
├── prisma/
│   └── schema.prisma     # Database schema
├── docker-compose.yml    # Docker configuration
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## Docker

### Start database only
```bash
docker-compose up -d
```

## Security

- Passwords are hashed before being stored
- JWT-based authentication
- Schema validation on all routes
- CORS configured for access control

## Available Scripts

- `npm run dev` - Starts the server in development mode
- `npm start` - Starts the server in production mode
- `npm run build` - Compiles TypeScript
- `npm test` - Runs tests
- `npm run db` - Runs migrations and generates Prisma Client
- `npm run docker` - Starts Docker Compose

## 👤 Author

**Ronald Junger**

---

**Developed with ❤️**

All positive or negative feedback is welcome. 