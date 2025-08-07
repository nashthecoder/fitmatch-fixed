import { useState } from 'react';

const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setLoading(true);
    try {
      // Google sign in logic would go here
      console.log('Google sign in');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
};

// Export both named and default
export { useGoogleSignIn };
export default useGoogleSignIn;