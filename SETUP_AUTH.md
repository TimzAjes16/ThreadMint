# Authentication Setup Guide - ThreadMint

## Overview

ThreadMint now has a complete authentication system using **Supabase Auth** for email/password authentication, with wallet connection integration via RainbowKit.

## Features Implemented

### ✅ Authentication System
- **AuthProvider** (`lib/auth-context.tsx`) - Centralized authentication state management
- **useAuth** hook - Easy access to auth state and methods throughout the app
- **LoginModal** - Email/password login with error handling
- **SignupModal** - User registration with profile creation
- **UserMenu** - Profile dropdown with sign out functionality

### ✅ Protected Actions
- **Create Post** - Requires authentication to post
- **Like** - Requires authentication to like posts
- **Bookmark** - Requires authentication to bookmark posts
- **Comment** - Requires authentication to comment on posts
- All protected actions automatically prompt login modal if not authenticated

### ✅ User Profile Integration
- User profiles created automatically on signup
- Wallet addresses can be linked to authenticated accounts
- 2D avatars generated based on user names
- Profile display in header when authenticated

## Setup Instructions

### 1. Environment Variables

Make sure you have the following in your `.env.local` file:

```bash
# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Wallet Connection (optional but recommended)
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
```

### 2. Database Setup

Run the Supabase migration to create the `users` table:

```sql
-- From migrations/001_initial_schema.sql
create table public.users (
  id uuid primary key default gen_random_uuid(),
  handle text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  wallet_address text unique,
  rep_score int default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Policies
create policy "Users are viewable by everyone" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid()::text = id::text);
```

### 3. Supabase Auth Configuration

1. Go to your Supabase dashboard
2. Navigate to **Authentication > Settings**
3. Enable **Email** provider
4. Configure email templates (optional)
5. Set up email verification (optional, recommended for production)

### 4. Testing the Authentication System

#### Test User Signup
1. Click on the profile avatar in the header
2. Click "Sign up" or "Create Account"
3. Enter username, email, and password
4. Click "Create Account"
5. User profile will be created automatically

#### Test User Login
1. Click on the profile avatar in the header
2. Enter your email and password
3. Click "Sign In"
4. You should be authenticated and able to:
   - Create posts
   - Like posts
   - Bookmark posts
   - Comment on posts
   - Access your profile and settings

#### Test Protected Actions
1. **Without authentication**: Try to like, bookmark, comment, or create a post
   - You should see a login prompt
2. **With authentication**: After logging in, all actions should work

#### Test Wallet Linking (Optional)
1. Sign in with email/password
2. Click "Connect Wallet" button
3. Connect your wallet
4. Your wallet address will be automatically linked to your account

#### Test Sign Out
1. Click on your profile avatar
2. Click "Sign Out"
3. You will be logged out and redirected

## API Endpoints

The authentication system uses Supabase's built-in Auth API:
- `supabase.auth.signUp()` - Create new user account
- `supabase.auth.signInWithPassword()` - Sign in with email/password
- `supabase.auth.signOut()` - Sign out current user
- `supabase.auth.getSession()` - Get current session
- `supabase.auth.onAuthStateChange()` - Listen for auth state changes

## User Data Flow

### Signup Flow
1. User enters username, email, password in SignupModal
2. `handleSignup()` calls `supabase.auth.signUp()`
3. Supabase creates auth user
4. Profile created in `public.users` table with user ID
5. User is automatically logged in
6. Auth state updates throughout app

### Login Flow
1. User enters email, password in LoginModal
2. `handleLogin()` calls `supabase.auth.signInWithPassword()`
3. Supabase validates credentials
4. Session created and stored
5. User profile fetched from `public.users`
6. Auth state updates throughout app

### Profile Creation
When a user signs up, a profile is automatically created:

```typescript
const { error: profileError } = await supabase
  .from('users')
  .insert({
    id: data.user.id,
    handle: username.toLowerCase(),
    display_name: username,
    bio: '',
  });
```

### Wallet Linking
When a user connects a wallet after authentication:

```typescript
const { error } = await supabase
  .from('users')
  .update({ wallet_address: walletAddress })
  .eq('id', user.id);
```

## Components Structure

```
components/
├── auth/
│   ├── LoginModal.tsx       # Email/password login
│   └── SignupModal.tsx      # User registration
├── layout/
│   ├── Header.tsx           # Header with login/signup integration
│   └── UserMenu.tsx         # Profile dropdown with sign out
└── post/
    ├── CreatePost.tsx       # Create post (protected)
    └── CommentThread.tsx    # Comment thread (protected)
```

## Auth Context Usage

```typescript
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {profile?.display_name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Testing Checklist

- [ ] User can sign up with email/password
- [ ] User profile is created on signup
- [ ] User can log in with correct credentials
- [ ] User sees error with incorrect credentials
- [ ] User can sign out
- [ ] Protected actions prompt login when not authenticated
- [ ] Authenticated user can create posts
- [ ] Authenticated user can like posts
- [ ] Authenticated user can bookmark posts
- [ ] Authenticated user can comment on posts
- [ ] Profile avatar shows in header when authenticated
- [ ] User menu shows when authenticated
- [ ] Wallet can be linked to authenticated account
- [ ] Auth state persists across page refreshes

## Next Steps

1. **Email Verification** (Optional): Enable email verification in Supabase settings
2. **Password Reset**: Implement forgot password functionality
3. **Profile Management**: Allow users to edit their profiles
4. **OAuth Providers**: Add Google, GitHub, Twitter login options
5. **2FA**: Add two-factor authentication for security
6. **Account Deletion**: Allow users to delete their accounts

## Troubleshooting

### "Authentication not configured" error
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check that Supabase is properly initialized in `lib/supabase.ts`

### "Failed to create profile" error
- Check that `users` table exists and has correct schema
- Verify Row Level Security policies are set up correctly
- Make sure service role key has write permissions

### Login modal not appearing
- Check that Header component is listening to `openLogin` event
- Verify that useEffect hook is properly set up in Header

### Auth state not persisting
- This is expected if Supabase is not configured
- With Supabase configured, sessions persist automatically
- Check Supabase dashboard > Authentication > Settings

## Security Considerations

1. **Never expose service role key** to client-side code
2. **Use RLS policies** to protect user data
3. **Validate inputs** on both client and server
4. **Use HTTPS** in production
5. **Enable email verification** for production
6. **Rate limit** authentication attempts
7. **Log security events** for monitoring

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
- [RainbowKit Documentation](https://rainbowkit.com/)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase dashboard > Authentication > Logs
3. Verify environment variables are correct
4. Check that database migration has been run
5. Review this guide and Supabase documentation

---

**Happy coding! 🚀**

