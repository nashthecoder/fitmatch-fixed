import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const useUserList = () => {
  const userList = useSelector((state: RootState) => state.user.userList);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Logic to fetch user list would go here
    setLoading(false);
  }, []);

  return { userList, loading };
};

// Export both named and default
export { useUserList };
export default useUserList;