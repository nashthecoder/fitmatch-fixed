import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCurrentUser } from '@/store/slices/userSlice';

const useUserActive = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    // Logic to handle user active state
    // This would typically involve Firebase Auth state listener
    console.log('User active hook initialized');
  }, []);

  return currentUser;
};

export default useUserActive;
