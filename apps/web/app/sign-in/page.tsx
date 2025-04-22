"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="mb-4 text-2xl font-bold">Sign In</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Button type="submit">Send magic link</Button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}