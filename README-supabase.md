# Supabase Setup for Tensorus

## Prerequisites

1. Node.js 18+
2. Supabase account
3. Supabase CLI (optional but recommended)

## Installation

1. **Install Supabase dependencies:**
   \`\`\`bash
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
   \`\`\`

2. **Set up Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for setup to complete

3. **Configure environment variables:**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   
   Fill in your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   \`\`\`

## Database Setup

1. **Run migrations:**
   - In your Supabase dashboard, go to SQL Editor
   - Run `supabase/migrations/001_initial_schema.sql`
   - Run `supabase/migrations/002_add_storage_policies.sql`

2. **Or using Supabase CLI:**
   \`\`\`bash
   supabase init
   supabase link --project-ref your-project-id
   supabase db push
   \`\`\`

## Authentication Configuration

1. **In your Supabase dashboard:**
   - Go to Authentication > Settings
   - Configure your site URL: `http://localhost:3000`
   - Add redirect URLs: `http://localhost:3000/auth/callback`
   
2. **Enable email auth:**
   - Go to Authentication > Providers
   - Ensure email is enabled
   - Optionally configure OAuth providers

## Storage Configuration

1. **Create storage bucket:**
   - Go to Storage in your Supabase dashboard
   - The `project-files` bucket should be created automatically
   - If not, create it manually with public access

## Key Features

### Database Schema

- **profiles**: User profiles extending auth.users
- **api_keys**: API key management with usage tracking
- **projects**: User projects with file uploads
- **tensors**: Tensor metadata and statistics
- **queries**: Query history and results
- **agent_messages**: AI agent communication logs

### Security

- **Row Level Security (RLS)**: All tables have RLS enabled
- **User isolation**: Users can only access their own data
- **API key authentication**: Secure API access with usage tracking
- **File storage**: User-scoped file access

### Features

- **Authentication**: Email/password with optional OAuth
- **API Key Management**: Generate, revoke, and track usage
- **Project Management**: File uploads and tensor processing
- **Query History**: Track AI interactions
- **Real-time**: Supabase realtime for live updates

## Development

1. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Access the application:**
   - Open http://localhost:3000
   - Create an account or use demo credentials
   - Navigate to /developer for API key management

## Migration from localStorage

The new Supabase implementation replaces localStorage with:

1. **Authentication**: JWT tokens managed by Supabase
2. **API Keys**: Stored in database with proper security
3. **Projects**: File uploads to Supabase storage
4. **Tensors**: Metadata stored in database
5. **Queries**: Persistent query history

## File Structure

\`\`\`
lib/supabase/
├── client.ts              # Client-side Supabase client
├── server.ts              # Server-side Supabase client
├── database.types.ts      # TypeScript types
├── auth.ts                # Authentication service
├── context.tsx            # Auth context provider
├── api-keys.ts            # API key management
├── projects.ts            # Project management
├── tensors.ts             # Tensor operations
└── queries.ts             # Query management

app/api/
├── auth/callback/         # Auth callback handler
├── api-keys/              # API key endpoints
├── projects/              # Project endpoints
├── tensors/               # Tensor endpoints
└── ai/query/              # AI query endpoint

supabase/
├── migrations/            # Database migrations
└── seed.sql              # Sample data
\`\`\`

## Testing

1. **Create test account:**
   - Navigate to `/auth/signup`
   - Create a new account
   - Verify email functionality

2. **Test API keys:**
   - Go to `/developer/keys`
   - Generate new API key
   - Test revocation and deletion

3. **Test projects:**
   - Create new project
   - Upload CSV file
   - Verify tensor processing

## Deployment

1. **Production environment:**
   \`\`\`bash
   NEXT_PUBLIC_SUPABASE_URL=your-production-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
   \`\`\`

2. **Configure auth redirect URLs:**
   - Add your production domain to Supabase auth settings
   - Update redirect URLs accordingly

## Troubleshooting

1. **Database connection issues:**
   - Verify environment variables
   - Check Supabase project status
   - Ensure correct region

2. **Authentication problems:**
   - Verify redirect URLs
   - Check email configuration
   - Ensure JWT secret is set

3. **Storage issues:**
   - Verify bucket exists
   - Check storage policies
   - Ensure file size limits

## Next Steps

1. Set up Redis for tensor caching
2. Implement real-time collaboration features
3. Add webhook endpoints for external integrations
4. Set up monitoring and analytics
5. Configure backup and disaster recovery
