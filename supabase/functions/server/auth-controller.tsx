import { Context } from 'npm:hono';
import { supabase } from './database.tsx';

/**
 * Authentication Controller
 * Handles user signup, login, logout, and profile management
 */

// Sign up new user
export async function signUp(c: Context) {
  try {
    const { email, password, fullName } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (authError) {
      console.error('Authentication error during signup:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName || null,
        role: 'customer',
      });

    if (profileError) {
      console.error('Profile creation error during signup:', profileError);
      return c.json({ error: 'Failed to create user profile' }, 500);
    }

    return c.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        fullName: fullName,
      },
    });
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return c.json({ error: 'An unexpected error occurred during signup' }, 500);
  }
}

// Sign in user
export async function signIn(c: Context) {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Use Supabase client from frontend for signIn
    // This endpoint is mainly for documentation - frontend will use Supabase client directly
    return c.json({
      message: 'Use Supabase client on frontend for signIn',
      instructions: 'Call supabase.auth.signInWithPassword({ email, password })',
    });
  } catch (error) {
    console.error('Unexpected error during signin:', error);
    return c.json({ error: 'An unexpected error occurred during signin' }, 500);
  }
}

// Get current user profile
export async function getUserProfile(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while fetching user profile:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return c.json({ error: 'Failed to fetch user profile' }, 500);
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error('Unexpected error while fetching user profile:', error);
    return c.json({ error: 'An unexpected error occurred while fetching profile' }, 500);
  }
}

// Update user profile
export async function updateUserProfile(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Authorization error while updating user profile:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { fullName } = await c.req.json();

    // Update profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ full_name: fullName })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return c.json({ error: 'Failed to update profile' }, 500);
    }

    return c.json({ success: true, profile: data });
  } catch (error) {
    console.error('Unexpected error while updating user profile:', error);
    return c.json({ error: 'An unexpected error occurred while updating profile' }, 500);
  }
}

// Verify if user is admin
export async function verifyAdmin(c: Context) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile.role !== 'admin') {
      return c.json({ error: 'Access denied. Admin privileges required.' }, 403);
    }

    return c.json({ success: true, isAdmin: true });
  } catch (error) {
    console.error('Unexpected error during admin verification:', error);
    return c.json({ error: 'An unexpected error occurred during admin verification' }, 500);
  }
}
