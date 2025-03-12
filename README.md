# FamilyCabin.io

A platform for family members who share a cabin to connect, organize, and manage their shared space.

![FamilyCabin.io Logo](./docs/images/logo.png)

## Overview

FamilyCabin.io is a web application that allows families to create and manage shared cabin spaces. Family members can join cabins, share important information, and stay connected with their shared property.

### Key Features

- **User Management**: Create accounts, join cabins, and manage user profiles
- **Cabin Directory**: Browse available cabins with thumbnail previews
- **Role-Based Access Control**: Admin and Member roles with different permissions
- **Invitation System**: Request to join cabins with admin approval
- **Notification System**: Get updates on invitation approvals and cabin activities

## Technology Stack

- **Frontend**: [Selected by Windsurf]
- **Backend**: [Selected by Windsurf]
- **Database**: [Selected by Windsurf]
- **API**: GraphQL
- **Deployment**: Ubuntu 22.04 LTS

## Development Setup

### Prerequisites

- Node.js (version specified in package.json)
- [Database system]
- Git

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/familycabin.git
   cd familycabin
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your local configuration.

4. Start the development server:
   ```
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Server Deployment

See the [Installation Guide](./docs/INSTALLATION.md) for detailed instructions on deploying to an Ubuntu 22.04 server.

## Project Structure

```
├── client/               # Frontend application
├── server/               # Backend API and server
├── docs/                 # Documentation
│   ├── INSTALLATION.md   # Deployment instructions
│   └── images/           # Documentation images
├── .env.example          # Example environment variables
├── docker-compose.yml    # Docker configuration (if applicable)
└── README.md             # This file
```

## Admin Access

The system includes a built-in Global Admin account:
- Username: admin
- Password: admin

**Important**: Change these credentials immediately after first login.

## Future Enhancements

Future versions may include:
- Process documentation
- Scheduling system
- Billing tracking
- Photo gallery
- OAuth authentication
- AWS microservices architecture

## License

MIT License

## Contact

[Your contact information]