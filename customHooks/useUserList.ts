import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface UserListResult {
  data: any[];
  isLoading: boolean;
  isError: boolean;
}

export const useUserList = (): UserListResult => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          uid: doc.id, // Ensure uid is also available for consistency
          ...doc.data()
        }));
        
        // Filter out any potential duplicates and ensure unique IDs
        const uniqueUsers = usersList.filter((user, index, self) => 
          index === self.findIndex(u => u.id === user.id)
        );
        
        setData(uniqueUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return {
    data,
    isLoading,
    isError,
  };
};
