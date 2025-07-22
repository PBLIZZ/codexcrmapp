import { supabase } from '../supabase/client';
import { authConfig } from './auth-config';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  businessName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Email/Password Authentication
export const signUpWithEmail = async (data: SignUpData) => {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          business_name: data.businessName,
        },
      },
    });

    if (error) throw error;

    // Create profile if user was created
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        business_name: data.businessName,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return { data: authData, error: null };
  } catch (error: unknown) {
    return { data: null, error };
  }
};

export const signInWithEmail = async (data: SignInData) => {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    return { data: authData, error: null };
  } catch (error: unknown) {
    return { data: null, error };
  }
};

// Google OAuth Authentication
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authConfig.supabase.redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error: unknown) {
    return { data: null, error };
  }
};

// Password Reset
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: unknown) {
    return { error };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: unknown) {
    return { error };
  }
};

// Sign Out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { error: null };
  } catch (error: unknown) {
    return { error };
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return { user, error: null };
  } catch (error: unknown) {
    return { user: null, error };
  }
};

// Get User Profile
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) throw error;

    return { profile: data, error: null };
  } catch (error: unknown) {
    return { profile: null, error };
  }
};

// Update User Profile
export const updateUserProfile = async (userId: string, updates: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { profile: data, error: null };
  } catch (error: unknown) {
    return { profile: null, error };
  }
};
