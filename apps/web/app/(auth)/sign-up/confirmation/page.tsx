import Link from 'next/link';

export default function SignUpConfirmationPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-2xl font-bold text-center">Account Created</h1>
      <p className="mb-6 text-center">
        Thank you for registering your account. Please check your email for the confirmation link to activate your account.
      </p>
      <div className="text-center">
        <Link href="/sign-in" className="font-medium text-blue-600 hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}