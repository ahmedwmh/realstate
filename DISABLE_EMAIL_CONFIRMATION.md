# How to Disable Email Confirmation in Supabase

To create users without email confirmation, follow these steps:

## Option 1: Disable Email Confirmation (Recommended)

1. Go to **Supabase Dashboard**
2. Navigate to: **Authentication > Settings**
3. Scroll down to **Email Auth** section
4. Find **"Confirm email"** toggle
5. **Turn OFF** the toggle (disable it)
6. Save changes

Now users can sign in immediately without confirming their email!

## Option 2: Use Service Role Key (For Development)

If you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file, the seed script will automatically:
- Create users with confirmed emails
- No email confirmation needed

To get Service Role Key:
1. Go to **Supabase Dashboard > Project Settings > API**
2. Find **service_role** key (hidden by default)
3. Click **"Reveal"** to see it
4. Copy and add to `.env`:
   ```
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

## After Disabling Email Confirmation

Run the seed script:
```bash
npm run db:reset
```

Users will be created and can login immediately without email confirmation!

