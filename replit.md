# Model Agency Creator Platform

## Overview

This is a React-based creator catalog web application built with Vite and designed to connect creators (models/influencers) with brands through a cyberpunk-themed digital platform. The application features two primary user roles - Creators and Admins - with distinct dashboards, profile management, media galleries, and in-app messaging capabilities.

The platform enables creators to build comprehensive portfolios with photos and videos while providing admins with powerful tools to browse, filter, and manage the creator database. The application emphasizes visual appeal with a cyberpunk aesthetic using purple, cyan, and magenta color schemes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The client-side application is built with React 18 using Vite as the build tool and development server. The architecture follows a component-based structure with:

- **Routing**: Uses Wouter for lightweight client-side routing with role-based route protection
- **State Management**: React Query (TanStack Query) for server state management with caching and background updates
- **UI Framework**: Custom component library built on Radix UI primitives with Tailwind CSS for styling
- **Design System**: Cyberpunk theme with consistent color palette and typography using Orbitron and Inter fonts
- **File Structure**: Organized by feature areas (creator, admin, messages) with shared UI components

### Backend Architecture

The server follows an Express.js REST API pattern with:

- **Framework**: Express.js with TypeScript for type safety
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Authentication**: Integration with Replit's OpenID Connect for user authentication and session management
- **API Design**: RESTful endpoints organized by feature areas with consistent error handling
- **Middleware**: Custom logging, error handling, and authentication middleware

### Database Design

PostgreSQL database with Drizzle ORM schema including:

- **Users Table**: Core user information with role-based access (creator/admin)
- **Creator Profiles**: Extended profile data including bio, location, measurements, and view tracking
- **Media Table**: File storage metadata for photos and videos with categorization
- **Messages Table**: In-app messaging system with read status tracking
- **Sessions Table**: Session storage for authentication state management

### Authentication System

Implements Replit's OpenID Connect flow with:

- **Session Management**: PostgreSQL-backed session storage with configurable TTL
- **Role-Based Access**: Middleware for route protection based on user roles
- **User Profile Integration**: Automatic user creation and profile linking on first login

### Media Management

File handling system supporting:

- **Upload Processing**: Multi-file drag-and-drop uploads with file type validation
- **Storage**: External file storage with URL-based references
- **Thumbnails**: Support for video thumbnail generation
- **Organization**: Media categorization and gallery management

### Styling Architecture

Comprehensive design system featuring:

- **Theme System**: CSS custom properties for consistent color management
- **Component Variants**: Class Variance Authority for component styling patterns
- **Responsive Design**: Mobile-first approach with desktop and tablet breakpoints
- **Animation**: Subtle animations and transitions for enhanced user experience

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern patterns
- **Vite**: Build tool and development server with hot module replacement
- **Express.js**: Backend web framework for API routes
- **TypeScript**: Type safety across frontend and backend

### Database & ORM
- **PostgreSQL**: Primary database via Neon serverless
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **@neondatabase/serverless**: Serverless PostgreSQL driver

### Authentication
- **Replit Auth**: OpenID Connect integration for user authentication
- **Passport.js**: Authentication middleware for Express
- **express-session**: Session management with PostgreSQL storage

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form handling with validation

### State Management
- **TanStack Query**: Server state management with caching
- **Zod**: Schema validation for type safety

### File Handling
- **react-dropzone**: Drag-and-drop file upload interface

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration