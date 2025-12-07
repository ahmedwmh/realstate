# Admin Dashboard Setup Guide

This guide will help you set up the admin dashboard for managing Hero sections and Projects with multi-user support.

## Prerequisites

1. Supabase account and project
2. PostgreSQL database (can use Supabase's built-in database)
3. Node.js and npm installed

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database (Supabase PostgreSQL connection strings)
# Use connection pooler for regular queries (port 6543)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
# Use direct connection for migrations (port 5432) - faster for db push/migrate
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.compute.amazonaws.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
# Alternative: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (if using newer Supabase CLI)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Supabase Storage
BUCKET_NAME="themind"
BUCKET_END_POINT="https://[YOUR-PROJECT-REF].storage.supabase.co/storage/v1/s3"
# Alternative names (will be used as fallback):
# NEXT_PUBLIC_SUPABASE_BUCKET_NAME="images"
# NEXT_PUBLIC_SUPABASE_BUCKET_ENDPOINT="https://[YOUR-PROJECT-REF].supabase.co/storage/v1/object/public/images"

# Authentication Secret (for simple auth system)
AUTH_SECRET="your-random-secret-key-here-change-in-production"
```

## Setup Steps

### 1. Create Supabase Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new bucket named `images`
4. Make it public (or configure policies as needed)

### 2. Initialize Prisma

Run the following commands:

```bash
npx prisma generate
npx prisma db push
```

This will:
- Generate the Prisma Client
- Push the schema to your database (including the Admin table)

### 3. Create Your First Admin User

You need to create your first admin user manually. You can do this in two ways:

#### Option A: Using Supabase Dashboard + Database

1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user with email and password
3. Copy the user ID
4. Go to Supabase Dashboard > SQL Editor
5. Run this SQL query (replace the values):

```sql
INSERT INTO "Admin" (id, email, "supabaseUserId", role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@alhulool-almuthla.com',
  'YOUR_SUPABASE_USER_ID_HERE',
  'super_admin',
  NOW(),
  NOW()
);
```

#### Option B: Using the Admin Dashboard (after first setup)

1. Create a super_admin user manually in the database first (Option A)
2. Log in to `/admin`
3. Go to `/admin/admins` (only visible to super_admin)
4. Create additional admin users from there

### 4. Access Admin Dashboard

Navigate to `/admin` in your application:
- Main dashboard: `http://localhost:3000/admin`
- Hero management: `http://localhost:3000/admin/hero`
- Projects management: `http://localhost:3000/admin/projects`
- Admins management: `http://localhost:3000/admin/admins` (super_admin only)

## Features

### Authentication
- Multi-user support using Supabase Auth
- Role-based access control (admin, super_admin)
- Secure session management
- Password-based authentication

### Hero Section Management
- Create, edit, and delete hero slides
- Upload images (main image and content image)
- Manage content in both English and Arabic
- Set display order for slides
- Automatic image deletion from Supabase Storage when slides are deleted or images are replaced

### Projects Management
- Create, edit, and delete projects
- Upload multiple images per project
- Manage content in both English and Arabic
- Set category and address
- Automatic image deletion from Supabase Storage when projects are deleted or images are removed

### Admin Management (Super Admin Only)
- View all admin users
- Create new admin users
- Edit admin details and roles
- Delete admin users (cannot delete yourself)
- Change admin passwords

## API Routes

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/check` - Check authentication status

### Hero
- `GET /api/hero` - Get all hero slides
- `POST /api/hero` - Create a new hero slide
- `PUT /api/hero` - Update a hero slide
- `DELETE /api/hero?id={id}` - Delete a hero slide

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects` - Update a project
- `DELETE /api/projects?id={id}` - Delete a project

### Admins (Super Admin Only)
- `GET /api/admins` - Get all admins
- `POST /api/admins` - Create a new admin
- `PUT /api/admins` - Update an admin
- `DELETE /api/admins?id={id}` - Delete an admin

### Upload
- `POST /api/upload` - Upload an image to Supabase Storage

## Database Schema

### HeroSlide
- `id` - Primary key
- `order` - Display order
- `titleEn` - English title
- `titleAr` - Arabic title
- `descriptionEn` - English description
- `descriptionAr` - Arabic description
- `mainImage` - Main slider image URL
- `contentImage` - Content area image URL
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Project
- `id` - Primary key
- `titleEn` - English title
- `titleAr` - Arabic title
- `descriptionEn` - English description
- `descriptionAr` - Arabic description
- `category` - Project category
- `images` - Array of image URLs
- `address` - Project address (optional)
- `features` - JSON object for features (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Admin
- `id` - Primary key (UUID)
- `email` - Admin email (unique)
- `name` - Admin name (optional)
- `role` - Admin role (admin, super_admin)
- `supabaseUserId` - Supabase Auth user ID (unique)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

## Roles

- **admin**: Can manage Hero sections and Projects
- **super_admin**: Can manage everything including other admins

## Security Notes

- All admin routes are protected by middleware
- Only authenticated users with Admin records can access admin routes
- Super admin routes require `super_admin` role
- Passwords are securely stored in Supabase Auth
- Sessions are managed by Supabase Auth
- Images are automatically deleted from Supabase Storage when items are deleted

## Troubleshooting

### Cannot login
- Make sure you've created an Admin record in the database linked to your Supabase Auth user
- Check that your email and password are correct
- Verify Supabase environment variables are set correctly

### Cannot access admin routes
- Ensure you're logged in
- Check that your user has an Admin record in the database
- Verify middleware is working correctly

### Cannot create admins
- Only super_admin users can create other admins
- Make sure your user has `role: 'super_admin'` in the Admin table
