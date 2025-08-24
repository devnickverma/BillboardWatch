# Billboard Compliance Monitoring System

## Overview

This is a full-stack web application for monitoring and reporting billboard compliance violations. The system allows users to submit reports with images and location data, provides a dashboard for tracking violations, and includes map visualization with heatmap capabilities. The application uses AI-powered image analysis to automatically categorize billboard violations and maintains comprehensive reporting statistics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and building
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod for type-safe form validation and data handling

### Backend Architecture  
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for type safety and modern JavaScript features
- **File Upload**: Multer middleware for handling multipart form data and image uploads
- **Storage Pattern**: Interface-based storage abstraction (currently in-memory, designed for easy database integration)
- **API Design**: RESTful endpoints with consistent error handling and request logging

### Data Storage Design
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Database**: PostgreSQL (via Neon serverless) for production data persistence
- **Schema Management**: Centralized schema definitions in shared directory with Zod validation
- **Migration Strategy**: Drizzle Kit for database migrations and schema management
- **Current State**: In-memory storage implementation for development, with database integration ready

### Authentication & Session Management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: Environment-based configuration with secure session management
- **User Context**: Simple user ID system ready for full authentication integration

### Image Processing & AI Integration
- **Upload Handling**: Memory-based file storage with 10MB size limits and image type validation
- **AI Analysis**: Mock Google Vision API integration for billboard content analysis
- **Image Storage**: Base64 data URLs for development (designed for cloud storage integration)
- **Content Categorization**: Automated violation type detection and description generation

### Map & Visualization Features
- **Mapping**: Leaflet.js integration for interactive map display
- **Heatmap**: Violation density visualization with location-based clustering
- **Geolocation**: Coordinate-based report positioning with location search capabilities
- **Real-time Updates**: Query invalidation and refetching for live data updates

### Development & Build System
- **Build Tool**: Vite with React plugin for fast development and optimized production builds
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Development Tools**: Hot module replacement, error overlays, and Replit-specific integrations
- **Production Build**: Separate client and server builds with ESBuild for server bundling

### External Service Integration Architecture
- **Database Connection**: Environment-based PostgreSQL connection with connection pooling
- **File Storage**: Designed for cloud storage integration (currently using data URLs)
- **AI Services**: Prepared for Google Vision API integration with mock implementation
- **Geolocation**: Browser-based location services with manual coordinate input fallback

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, React Hook Form, and TanStack Query for modern React patterns
- **UI Component Library**: Radix UI primitives with Shadcn/ui for accessible, customizable components
- **Styling & Design**: Tailwind CSS with PostCSS for utility-first styling and design system

### Backend & Database
- **Server Framework**: Express.js with TypeScript and ES module support
- **Database**: Neon PostgreSQL serverless with Drizzle ORM for type-safe database operations
- **Session Management**: connect-pg-simple for PostgreSQL-backed session storage
- **File Handling**: Multer for multipart form data and file upload processing

### Development Tools
- **Build System**: Vite with React plugin and ESBuild for fast development and production builds
- **Type Checking**: TypeScript with strict configuration for comprehensive type safety
- **Development Experience**: Replit-specific plugins for cartographer and error handling

### Map & Visualization
- **Mapping Library**: Leaflet.js loaded dynamically for interactive map functionality
- **Geolocation**: Browser geolocation API with coordinate input fallback
- **Data Visualization**: Custom heatmap implementation for violation density mapping

### Validation & Utilities
- **Schema Validation**: Zod for runtime type validation and schema definition
- **Date Handling**: date-fns for date manipulation and formatting
- **Utility Libraries**: clsx and tailwind-merge for conditional class handling
- **Icons**: Lucide React for consistent iconography throughout the application