# Complete Prisma Monorepo Configuration for CodeX CRM: Supabase Free Plan Setup

This guide addresses the specific constraints of your existing CodeX CRM monorepo setup with Supabase's free plan:
- ✅ **Introspection-only workflow** (no migrations due to free plan)
- ✅ **IPv6 connectivity workarounds** for connection issues
- ✅ **Remote-only Supabase** setup (no local development)
- ✅ **Existing monorepo structure** with packages/db/

## Your Current Setup Analysis
- **Project**: CodeX CRM Monorepo
- **Database Package**: `packages/db/` (already exists)
- **Prisma Version**: 6.11.1
- **Database**: PostgreSQL (Supabase)
- **Architecture**: Turbo monorepo with pnpm

## ⚡ IMMEDIATE ACTION PLAN FOR YOUR SETUP

**You already have a well-structured setup!** Here's what we need to fix:

### Issues to Address:
1. **⚠️ Supabase Free Plan Limitation**: Introspection-only (no `prisma migrate`)
2. **⚠️ IPv6 Connection Issues**: Need alternative connection methods
3. **⚠️ Auth Schema Relations**: Currently commented out in your schema

### Quick Fix Steps:

#### Step 1: Set Up Environment Variables
Create `.env` in your project root:

```bash
# Database Connection URLs for Supabase (IPv4 workaround)
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR_PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres"

# Your existing API keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
# ... other keys from .env.example
```

#### Step 2: Update Your Database Package Scripts
Update `packages/db/package.json` for free plan compatibility:

```json
{
  "scripts": {
    "dev": "echo 'Database package ready - client generated'",
    "db:pull": "prisma db pull",
    "db:push": "echo 'Push disabled on free plan - use Supabase dashboard'",
    "db:migrate": "echo 'Migrations disabled on free plan - use db:pull'",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "build": "pnpm db:generate",
    "introspect": "prisma db pull && prisma generate",
    "test-connection": "prisma db execute --stdin < /dev/null"
  }
}
```

#### Step 3: Create Your Tables in Supabase Dashboard
Since you can't migrate, create these manually in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create your contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    job_title TEXT,
    company_name TEXT,
    profile_image_url TEXT,
    website TEXT,
    tags TEXT[] DEFAULT '{}',
    social_handles TEXT[] DEFAULT '{}',
    address_street TEXT,
    address_city TEXT,
    address_postal_code TEXT,
    address_country TEXT,
    phone_country_code TEXT,
    notes TEXT,
    source TEXT,
    last_contacted_at TIMESTAMPTZ,
    
    -- Wellness fields
    wellness_goals TEXT[] DEFAULT '{}',
    wellness_journey_stage TEXT,
    wellness_status TEXT,
    last_assessment_date TIMESTAMPTZ,
    client_since TIMESTAMPTZ,
    relationship_status TEXT,
    referral_source TEXT,
    
    -- AI & Enrichment fields
    enrichment_status TEXT DEFAULT 'pending',
    enriched_data JSONB,
    communication_preferences JSONB,
    
    -- Metadata
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    color TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create group_members junction table
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, contact_id)
);

-- Add RLS policies
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own contacts" ON public.contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own groups" ON public.groups FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own group members" ON public.group_members FOR ALL USING (
    EXISTS (SELECT 1 FROM public.groups WHERE groups.id = group_members.group_id AND groups.user_id = auth.uid())
);
```

#### Step 4: Fix Your Prisma Schema
Update `packages/db/prisma/schema.prisma` to enable auth relations:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
  schemas   = ["public", "auth"]
}

// Enable auth.users relation
model User {
  id        String   @id @db.Uuid
  email     String?
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @default(now()) @map("updated_at") @db.Timestamptz
  
  contacts  Contact[]
  groups    Group[]

  @@map("users")
  @@schema("auth")
}

// Your existing models with relations enabled
model Contact {
  // ... your existing fields ...
  
  // Relations
  userId                    String    @map("user_id") @db.Uuid
  user                      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  groups                    GroupMember[]

  @@map("contacts")
  @@schema("public")
}

model Group {
  // ... your existing fields ...
  
  // Relations
  userId      String   @map("user_id") @db.Uuid
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  members     GroupMember[]

  @@map("groups")
  @@schema("public")
}

// GroupMember stays the same
```

#### Step 5: IPv6 Workaround Options

Try these connection URLs in order:

1. **Connection Pooler (IPv4 friendly)**:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true"
   ```

2. **IPv4 over IPv6 tunnel** (if you have access):
   ```bash
   # Use Cloudflare WARP or similar IPv6-to-IPv4 proxy
   ```

3. **Use different DNS resolver**:
   ```bash
   # Add to /etc/hosts (requires sudo)
   echo "[IPV4_IP] [project-ref].supabase.co" | sudo tee -a /etc/hosts
   ```

#### Step 6: Test Your Setup

```bash
# Test connection
cd packages/db
pnpm test-connection

# Pull schema from Supabase
pnpm db:pull

# Generate Prisma client
pnpm db:generate

# Open Prisma Studio
pnpm db:studio
```

#### Step 7: Create Database Index File
Update `packages/db/src/index.ts`:

```typescript
import { PrismaClient } from './prisma/generated/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export * from './prisma/generated/client';
export type { PrismaClient } from './prisma/generated/client';
```

---

## Architecture Overview

The **optimal approach** is to install Prisma in a **shared database package** (`packages/database`) rather than inside individual Next.js apps or at the monorepo root. This provides several key advantages:

- **Centralized database schema management** across all applications
- **Type-safe database operations** shared between apps
- **Single source of truth** for database models and migrations
- **Better dependency management** with clear separation of concerns
- **Easier maintenance** and updates to database-related code

## Project Structure

The recommended monorepo structure follows this pattern:

```
my-monorepo/
├── apps/
│   └── web/                    # Next.js 15 app
├── packages/
│   └── database/               # Shared Prisma package (RECOMMENDED LOCATION)
├── pnpm-workspace.yaml
├── package.json
└── .gitignore
```

## Step-by-Step Installation Guide

### 1. Initialize Monorepo Structure

```bash
# Create root directory
mkdir my-monorepo && cd my-monorepo
pnpm init

# Create workspace structure
mkdir -p apps packages/database
```

### 2. Configure pnpm Workspaces

Create `pnpm-workspace.yaml` at the root:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'

catalogs:
  prisma:
    prisma: '6.3.1'
    '@prisma/client': '6.3.1'
```

The catalogs feature ensures consistent Prisma versions across all packages.

### 3. Set Up Shared Database Package

Navigate to the database package directory:

```bash
cd packages/database
pnpm init
```

Configure `packages/database/package.json`:

```json
{
  "name": "database",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:introspect": "prisma db pull",
    "db:push": "prisma db push"
  },
  "dependencies": {
    "@prisma/client": "catalog:prisma"
  },
  "devDependencies": {
    "prisma": "catalog:prisma",
    "typescript": "^5.7.2",
    "@types/node": "^22.10.2"
  }
}
```

### 4. Install Prisma Dependencies

```bash
# From packages/database directory
pnpm install
pnpm add typescript tsx @types/node -D
```

### 5. Initialize Prisma

```bash
pnpm prisma init
```

This creates the `prisma/` directory with `schema.prisma` and `.env` files.

## Environment Variables Configuration

### Location and Files

Environment variables should be configured in **both locations**:

1. `packages/database/.env` (for Prisma operations)
2. `apps/web/.env.local` (for Next.js app)

### Supabase Connection Strings (2025 Format)

Based on the latest Supabase API settings, you have three connection options:

#### Option 1: Direct Connection (IPv6, for persistent servers)

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

#### Option 2: Session Mode Pooler (IPv4/IPv6, recommended for Next.js)

```bash
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

#### Option 3: Transaction Mode Pooler (IPv4/IPv6, for serverless/edge functions)

```bash
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

### Complete Environment Variables

**For `packages/database/.env` and `apps/web/.env.local`:**

```bash
# Database Connection (choose one option above)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase API Configuration (for Next.js app)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Development Environment
NODE_ENV="development"
```

### New Supabase API Key Format (2025)

Supabase is transitioning to new API key formats:

- **Publishable keys**: `sb_publishable_...` (replaces `anon` key)
- **Secret keys**: `sb_secret_...` (replaces `service_role` key)

You can opt into these in your Supabase dashboard, but the traditional JWT-based keys still work.

## Prisma Schema Configuration

Configure `packages/database/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public", "auth"]
}

// Example model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@schema("public")
}
```

## Supabase Database Setup for Prisma

Before running introspection, create a dedicated Prisma user in Supabase with proper permissions. Run this SQL in your Supabase SQL Editor:

```sql
-- Create custom Prisma user
CREATE USER "prisma" WITH PASSWORD 'your-secure-password' BYPASSRLS CREATEDB;

-- Grant necessary permissions
GRANT "prisma" TO "postgres";
GRANT USAGE ON SCHEMA public TO prisma;
GRANT CREATE ON SCHEMA public TO prisma;
GRANT ALL ON ALL TABLES IN SCHEMA public TO prisma;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO prisma;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO prisma;

-- Set default privileges
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO prisma;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO prisma;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO prisma;

-- For auth schema access (if needed)
GRANT USAGE ON SCHEMA auth TO prisma;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO prisma;
```

## Prisma Client Setup with Singleton Pattern

Create `packages/database/src/client.ts`:

```typescript
import { PrismaClient } from './generated/client';

// Global variable for singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with singleton pattern for Next.js hot reload
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

This singleton pattern prevents the "multiple Prisma Client instances" warning during Next.js development.

Create `packages/database/src/index.ts`:

```typescript
export { prisma } from './client';
export * from './generated/client';
```

## Prisma Introspection Setup

### 1. Run Database Introspection

```bash
# From packages/database directory
pnpm db:introspect
```

This command pulls your existing Supabase schema into your Prisma schema file.

### 2. Generate Prisma Client

```bash
pnpm db:generate
```

### 3. Handle Supabase-Specific Tables

After introspection, you'll see many Supabase-managed tables (like `auth.users`, `storage.buckets`, etc.). You can:

- **Keep them** if you need programmatic access
- **Remove them** from your schema if you only need your custom tables
- **Create a separate schema** for private tables not exposed via the API

## Next.js App Configuration

### 1. Create Next.js App

```bash
cd ../../apps
pnpm create next-app@latest web --typescript --tailwind --eslint --app --no-src-dir
cd web
```

### 2. Add Database Package Dependency

In `apps/web/package.json`:

```json
{
  "dependencies": {
    "database": "workspace:*",
    "next": "15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### 3. Configure Next.js

Update `apps/web/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['database'],
  experimental: {
    serverComponentsExternalPackages: ['database'],
  },
};

export default nextConfig;
```

### 4. Use in Next.js App Router

Create `apps/web/app/page.tsx`:

```typescript
import { prisma } from 'database';

export default async function Home() {
  const userCount = await prisma.user.count();

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold'>Next.js 15 + Prisma + Supabase</h1>
      <p>Total users: {userCount}</p>
    </div>
  );
}
```

Create API routes in `apps/web/app/api/users/route.ts`:

```typescript
import { prisma } from 'database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Final Setup and Development

### 1. Install All Dependencies

```bash
# From monorepo root
cd ../../
pnpm install
```

### 2. Root Package.json Scripts

Add these scripts to your root `package.json`:

```json
{
  "scripts": {
    "build": "pnpm --filter database db:deploy && pnpm --filter database db:generate && pnpm --filter web build",
    "dev": "pnpm --filter database db:generate && pnpm --filter web dev",
    "start": "pnpm --filter web start",
    "studio": "pnpm --filter database db:studio"
  }
}
```

### 3. Start Development

```bash
pnpm dev
```

## Key Benefits of This Setup

✅ **Centralized database management** in shared package  
✅ **Type-safe operations** across all applications  
✅ **Hot reload support** with singleton pattern  
✅ **Supabase Auth integration** ready  
✅ **Connection pooling** optimized for Next.js  
✅ **Environment-specific** configurations  
✅ **Scalable monorepo** architecture

## Troubleshooting Common Issues

### Multiple Prisma Client Instances Warning

Use the singleton pattern in your database package client configuration as shown above.

### Connection Issues

- Verify your `DATABASE_URL` format matches your chosen Supabase connection method
- For introspection, use the direct connection string (port 5432) rather than pooled connections
- Ensure your Prisma user has the necessary permissions in Supabase

### Schema Introspection Problems

- Make sure the Prisma user exists and has proper privileges
- Use the correct connection string format for your Supabase region
- Check that both `public` and `auth` schemas are accessible if needed

### Build/Deployment Issues

- Ensure `transpilePackages` includes "database" in `next.config.js`
- Verify all environment variables are set in production
- Run `db:generate` before the build process in your CI/CD pipeline

This configuration provides a robust, scalable foundation for building full-stack applications with Prisma, Next.js 15, and Supabase in a monorepo setup.
