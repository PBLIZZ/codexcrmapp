import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AuthCallbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/auth/login'), 3000);
          return;
        }

        if (data.session) {
          // Check if profile exists, create if not
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email,
                first_name: data.session.user.user_metadata?.given_name || '',
                last_name: data.session.user.user_metadata?.family_name || '',
                avatar_url: data.session.user.user_metadata?.avatar_url || '',
              });

            if (insertError) {
              console.error('Profile creation error:', insertError);
            }
          }

          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          setError('No session found. Please try signing in again.');
          setTimeout(() => navigate('/auth/login'), 3000);
        }
      } catch (err: any) {
        console.error('Callback handling error:', err);
        setError('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/auth/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <Heart size={32} className="text-white" />
          </div>
          
          {loading ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
              <p className="text-gray-600 mb-6">Please wait while we set up your account...</p>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            </>
          ) : error ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;