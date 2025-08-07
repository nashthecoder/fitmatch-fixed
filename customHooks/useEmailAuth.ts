import { useState } from 'react';

const useEmailAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Firebase email auth logic would go here
      console.log('Email sign in:', email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Firebase email signup logic would go here
      console.log('Email sign up:', email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { signIn, signUp, loading, error };
};

// Export both named and default
export { useEmailAuth };
export default useEmailAuth;