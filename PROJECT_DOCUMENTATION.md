# Ebook Platform - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema & ERM](#database-schema--erm)
5. [Authentication & Authorization](#authentication--authorization)
6. [Core Features & Processes](#core-features--processes)
7. [File Structure](#file-structure)
8. [API Endpoints & Functions](#api-endpoints--functions)
9. [Security Implementation](#security-implementation)
10. [Deployment & Infrastructure](#deployment--infrastructure)

---

## Project Overview

**Project Name:** Ebook Platform  
**Type:** Full-stack web application  
**Purpose:** Digital library platform for sharing, browsing, and managing ebooks  
**Target Users:** General users, Content creators, Administrators  

### Key Objectives
- Provide a secure platform for ebook sharing
- Enable user-friendly browsing and search functionality
- Implement robust content moderation system
- Support multiple user roles with appropriate permissions
- Ensure scalable and maintainable codebase

---

## Technology Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** TanStack Query (React Query) for server state
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Theming:** next-themes for dark/light mode

### Backend & Database
- **Backend-as-a-Service:** Supabase
- **Database:** PostgreSQL (managed by Supabase)
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage
- **Real-time:** Supabase Realtime

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Type Checking:** TypeScript
- **Version Control:** Git
- **Deployment:** Lovable platform

---

## System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Storage       │
│   (React/Vite)  │◄──►│   (Backend)     │◄──►│   (Files)       │
│                 │    │                 │    │                 │
│ - UI Components │    │ - PostgreSQL    │    │ - Ebooks        │
│ - State Mgmt    │    │ - Auth System   │    │ - Cover Images  │
│ - Routing       │    │ - RLS Policies  │    │ - Blog Images   │
│ - API Calls     │    │ - Edge Functions│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture
```
App.tsx
├── AuthContext (Global auth state)
├── Navbar (Navigation)
├── Routes
│   ├── Public Routes
│   │   ├── Index (Homepage)
│   │   ├── Browse (Book catalog)
│   │   ├── Blog (Blog posts)
│   │   └── Auth pages
│   ├── Protected Routes
│   │   ├── Profile
│   │   ├── Library
│   │   ├── Upload
│   │   └── Settings
│   └── Admin Routes
│       ├── Dashboard
│       ├── User Management
│       ├── Content Management
│       └── Analytics
└── Footer
```

---

## Database Schema & ERM

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    auth.users   │     │    profiles     │     │   admin_users   │
│                 │────►│                 │     │                 │
│ - id (PK)       │     │ - id (PK,FK)    │     │ - id (PK)       │
│ - email         │     │ - email         │◄────│ - email         │
│ - created_at    │     │ - full_name     │     │ - full_name     │
│                 │     │ - avatar_url    │     │ - is_active     │
└─────────────────┘     │ - role          │     │ - created_by    │
                        │ - created_at    │     └─────────────────┘
                        └─────────────────┘              │
                                 │                       │
                                 ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     ebooks      │     │user_downloads   │     │ admin_actions   │
│                 │     │                 │     │                 │
│ - id (PK)       │◄────│ - id (PK)       │     │ - id (PK)       │
│ - title         │     │ - user_id (FK)  │     │ - admin_id (FK) │
│ - author        │     │ - ebook_id (FK) │     │ - action_type   │
│ - description   │     │ - downloaded_at │     │ - target_type   │
│ - category      │     └─────────────────┘     │ - target_id     │
│ - file_url      │              │              │ - details       │
│ - cover_image   │              │              └─────────────────┘
│ - uploaded_by   │──────────────┘
│ - status        │
│ - downloads     │
│ - is_featured   │
└─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   categories    │     │ebook_categories │     │     flags       │
│                 │     │                 │     │                 │
│ - id (PK)       │◄────│ - id (PK)       │     │ - id (PK)       │
│ - name          │     │ - ebook_id (FK) │     │ - ebook_id (FK) │
│ - description   │     │ - category_id   │────►│ - reporter_id   │
│ - created_at    │     │   (FK)          │     │ - reason        │
└─────────────────┘     │ - created_at    │     │ - description   │
                        └─────────────────┘     │ - status        │
                                                │ - reviewed_by   │
┌─────────────────┐                             │ - admin_notes   │
│     blogs       │                             └─────────────────┘
│                 │
│ - id (PK)       │
│ - title         │
│ - content       │
│ - excerpt       │
│ - author_id(FK) │
│ - category      │
│ - status        │
│ - featured_image│
└─────────────────┘
```

### Table Descriptions

#### Core Tables

**profiles**
- Extends auth.users with additional user information
- Links to admin_users via email for role management
- Contains user preferences and settings

**ebooks**
- Central entity for book management
- Links to uploader via uploaded_by
- Contains metadata, file references, and approval status

**categories**
- Manages book categorization
- Used for filtering and organization

**ebook_categories**
- Many-to-many relationship between ebooks and categories
- Allows books to belong to multiple categories

#### Administrative Tables

**admin_users**
- Defines admin privileges
- Separate from profiles for security

**super_admins**
- Highest privilege level
- Protected from modification by non-super-admins

**admin_actions**
- Audit trail for administrative actions
- Tracks all admin operations

#### Content Management

**blogs**
- Blog post management
- Author attribution and categorization

**flags**
- Content reporting system
- Tracks reported issues and admin responses

**user_downloads**
- Download tracking
- Prevents duplicate download counting

---

## Authentication & Authorization

### Authentication Flow
1. **User Registration/Login**
   - Handled by Supabase Auth
   - Email/password authentication
   - Automatic profile creation via trigger

2. **Role Assignment**
   - Default role: 'user'
   - Admin role assigned via admin_users table
   - Super admin role via super_admins table

3. **Session Management**
   - JWT tokens managed by Supabase
   - Automatic token refresh
   - Secure session storage

### Authorization Levels

#### User Roles
```
User (Default)
├── Browse approved ebooks
├── Download ebooks
├── Upload ebooks (pending approval)
├── Manage own profile
├── Report content
└── View own download history

Admin
├── All user permissions
├── Approve/reject ebooks
├── Manage all users
├── Manage categories
├── Review flags
├── View analytics
└── Moderate content

Super Admin
├── All admin permissions
├── Manage admin users
├── System configuration
└── Cannot be modified by others
```

### Row Level Security (RLS) Policies

#### Key Security Principles
- **Principle of Least Privilege**: Users can only access data they need
- **Data Isolation**: Users can only see their own data unless explicitly shared
- **Admin Protection**: Super admins cannot be modified by regular admins
- **Content Moderation**: Only approved content is publicly visible

---

## Core Features & Processes

### 1. Ebook Management Process

#### Upload Process
```
User uploads ebook → File stored in Supabase Storage → 
Database entry created (status: pending) → 
Admin reviews → Approve/Reject → 
If approved: status = 'approved', publicly visible
```

#### Download Process
```
User clicks download → Check authentication → 
Increment download count → Track in user_downloads → 
Provide file access
```

### 2. Content Moderation Process

#### Flag Resolution
```
User reports content → Flag created (status: pending) → 
Admin reviews flag → Admin takes action → 
Flag status updated → Original content status may change
```

#### Admin Review Workflow
```
Content submitted → Pending queue → Admin review → 
Decision (approve/reject/flag) → Status update → 
User notification → Audit log entry
```

### 3. User Management Process

#### Registration Flow
```
User signs up → Auth user created → Profile trigger fires → 
Profile created → Check admin_users table → 
Role assignment → Welcome process
```

#### Role Elevation
```
Admin adds user to admin_users → Profile role updated → 
Admin permissions granted → Audit log entry
```

### 4. Search & Discovery Process

#### Search Implementation
```
User enters query → Search across title/author/description → 
Apply category filters → Sort by relevance/popularity → 
Return paginated results
```

#### Featured Content
```
Admin marks content as featured → Featured flag set → 
Content appears in featured sections → 
Rotation based on criteria
```

---

## File Structure

### Source Code Organization
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── admin/           # Admin-specific components
│   ├── BookCard.tsx     # Book display component
│   ├── Navbar.tsx       # Navigation component
│   ├── SearchComponent.tsx
│   └── ...
├── pages/               # Route components
│   ├── Index.tsx        # Homepage
│   ├── Browse.tsx       # Book catalog
│   ├── Admin*/          # Admin pages
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useEbooks.tsx    # Ebook data management
│   ├── useAdminData.tsx # Admin data operations
│   └── ...
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state
├── services/            # External service integrations
│   └── chatbotService.ts
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility libraries
│   └── utils.ts         # Helper functions
└── styles/
    ├── index.css        # Global styles and design tokens
    └── App.css          # Component styles
```

### Key Configuration Files
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `supabase/config.toml` - Supabase project configuration

---

## API Endpoints & Functions

### Supabase Database Functions

#### Security Functions
```sql
is_user_admin(user_id) -> boolean
is_email_super_admin(email) -> boolean
is_super_admin_by_user(user_id) -> boolean
```

#### Business Logic Functions
```sql
increment_download_count(ebook_uuid, user_uuid) -> void
search_ebooks(search_query) -> table
log_admin_action(action_type, target_type, target_id, details) -> void
get_current_user_role() -> text
```

#### Trigger Functions
```sql
handle_new_user() -> trigger function
handle_updated_at() -> trigger function
check_admin_user() -> trigger function
prevent_non_admin_role_change() -> trigger function
```

### Storage Buckets
- **ebooks**: PDF files and documents
- **covers**: Book cover images
- **blog-images**: Blog post images

### Real-time Subscriptions
- Ebook status changes
- New uploads
- Admin actions
- User profile updates

---

## Security Implementation

### Current Security Score: 8/10

#### Strengths
✅ **Authentication & Authorization**
- Supabase Auth integration
- JWT token management
- Role-based access control

✅ **Database Security**
- Row Level Security (RLS) on all tables
- Super admin protection mechanisms
- Audit logging for admin actions

✅ **Content Moderation**
- Approval workflow for uploads
- Flag reporting system
- Admin review processes

✅ **API Security**
- Database functions with security definer
- Input validation through TypeScript
- Protected admin endpoints

#### Areas for Improvement
⚠️ **Database Warnings**
- Function search_path configuration
- Password leak protection not enabled

⚠️ **File Upload Security**
- File type validation needed
- File size limits
- Malware scanning

⚠️ **Rate Limiting**
- API rate limiting not implemented
- Upload frequency limits needed

#### Security Recommendations
1. Enable password leak protection in Supabase Auth
2. Implement comprehensive file upload validation
3. Add rate limiting for API endpoints
4. Enhance input sanitization
5. Implement CSP headers
6. Add automated security scanning

---

## Deployment & Infrastructure

### Current Deployment
- **Platform**: Lovable (development/staging)
- **Database**: Supabase (managed PostgreSQL)
- **Storage**: Supabase Storage
- **CDN**: Automatic via Lovable

### Production Considerations
- Custom domain configuration
- SSL certificate management
- Database backup strategy
- File storage redundancy
- Performance monitoring
- Error tracking

### Scaling Strategy
- Database indexing optimization
- File storage CDN implementation
- Caching layer addition
- Load balancing for high traffic
- Database read replicas

---

## Development Workflow

### Getting Started
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture
- Custom hooks for business logic

### Testing Strategy
- Component testing with React Testing Library
- Integration testing for database operations
- E2E testing for critical user flows
- Security testing for authentication flows

---

## Maintenance & Monitoring

### Regular Tasks
- Database performance monitoring
- Storage usage tracking
- User activity analysis
- Security audit reviews
- Dependency updates

### Key Metrics
- User registration rate
- Upload approval time
- Download statistics
- Search performance
- Error rates

### Backup & Recovery
- Automated database backups via Supabase
- File storage redundancy
- Configuration backup procedures
- Disaster recovery planning

---

## Future Enhancements

### Planned Features
- Mobile app development
- Advanced search filters
- Social features (reviews, ratings)
- Recommendation system
- Multi-language support

### Technical Improvements
- GraphQL API implementation
- Microservices architecture
- Enhanced caching strategy
- Advanced analytics
- AI-powered content moderation

---

## Contact & Support

### Development Team
- Platform: Lovable
- Documentation: This file
- Version Control: Git repository

### Resources
- Supabase Documentation: https://supabase.com/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Lovable Platform: https://lovable.dev

---

*Last Updated: January 2025*
*Version: 1.0*