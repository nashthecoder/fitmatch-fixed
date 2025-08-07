import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const useUserActive = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    // Logic to handle user active state
    // This would typically involve Firebase Auth state listener
  }, []);

  return currentUser;
};

export default useUserActive;
