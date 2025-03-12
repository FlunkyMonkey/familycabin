# FamilyCabin.io Architecture Overview

This document provides a comprehensive overview of the FamilyCabin.io application architecture, including technical specifications, design patterns, and component interactions.

## System Architecture

FamilyCabin.io follows a modern full-stack JavaScript architecture with the following components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │◄────┤  GraphQL API   │◄────┤  MongoDB        │
│  (Client)       │     │  (Server)       │     │  (Database)     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18.2.0
- **UI Library**: Material-UI 5.14.0
- **Routing**: React Router 6.14.1
- **State Management**: React Context API + Apollo Client
- **GraphQL Client**: Apollo Client 3.8.0
- **Authentication**: JWT-based with local storage

#### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **API**: GraphQL with Apollo Server 3.12.0
- **Authentication**: JWT (jsonwebtoken 9.0.1)
- **Password Hashing**: bcrypt 5.1.0
- **Logging**: Winston 3.10.0

#### Database
- **Database**: MongoDB
- **ODM**: Mongoose 7.4.0

## Application Components

### Client-Side Architecture

The React frontend is organized into the following structure:

```
client/
├── public/              # Static assets
│   ├── images/          # Image assets
│   └── index.html       # HTML entry point
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context providers
│   ├── graphql/         # GraphQL queries and mutations
│   ├── pages/           # Page components
│   └── utils/           # Utility functions
└── package.json         # Dependencies and scripts
```

#### Key Frontend Features
- **Responsive Design**: Mobile and desktop-friendly layouts
- **Theme**: Nature-inspired with woods, lake, and rustic cabin aesthetics
- **Authentication**: JWT-based local authentication
- **Real-time Updates**: Apollo Client cache updates

### Server-Side Architecture

The Node.js backend follows this structure:

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── graphql/         # GraphQL schema and resolvers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose data models
│   └── utils/           # Utility functions
└── package.json         # Dependencies and scripts
```

#### Key Backend Features
- **GraphQL API**: Type-safe API with Apollo Server
- **Authentication**: JWT-based with middleware protection
- **Authorization**: Role-based access control (RBAC)
- **Data Validation**: GraphQL and Mongoose schema validation
- **Error Logging**: Winston logger writing to /var/log/familycabin

## Data Models

### User Model
- Username (unique)
- Email (unique)
- Password (hashed)
- Name
- Address
- Bio
- Member Since Date
- Role (USER or GLOBAL_ADMIN)
- Cabin Memberships (with roles)
- Notifications

### Cabin Model
- Name
- Description
- Location
- Image
- Created By (User reference)
- Members (with roles)
- Membership Requests

## Authentication & Authorization

FamilyCabin.io implements a role-based access control system:

1. **Global Admin**: Has full access to all system features
2. **Cabin Admin**: Can manage a specific cabin and approve membership requests
3. **Cabin Member**: Has access to cabin content but limited management capabilities

Authentication is handled via JWT tokens with a 2-hour expiration. All sensitive routes and GraphQL operations require authentication.

## API Design

The GraphQL API provides a single endpoint (`/graphql`) with the following operation categories:

- **User Operations**: Registration, authentication, profile management
- **Cabin Operations**: Create, read, update, delete cabins
- **Membership Operations**: Request, approve, reject membership
- **Notification Operations**: Manage user notifications

## Security Considerations

- **Password Security**: Passwords are hashed using bcrypt
- **JWT Security**: Tokens are signed with a secret key
- **Input Validation**: All user inputs are validated
- **Error Handling**: Errors are logged but not exposed to clients
- **HTTPS**: Self-signed certificate in development, with plans for trusted certificates in production

## Scalability & Future Extensions

The application is designed to be horizontally scalable:

- **Stateless Backend**: Allows for multiple server instances
- **Database Scaling**: MongoDB can be scaled through sharding and replication
- **Microservices Path**: The current monolithic design can be refactored into microservices

Future planned extensions include:
- OAuth authentication
- Process documentation features
- Scheduling system
- Billing tracking
- Photo gallery
- AWS microservices architecture

## Development Workflow

1. Local development on MacOS
2. Version control with Git/GitHub
3. Deployment to Ubuntu 22.04 server
4. Potential future CI/CD pipeline
