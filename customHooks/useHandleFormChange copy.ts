import { useDispatch } from 'react-redux';
import { updateUserData } from '@/store/userSlice';

export const useHandleFormChange = () => {
  const dispatch = useDispatch();

  const handleChange = (field: string, value: any) => {
    dispatch(updateUserData({ [field]: value }));
  };

  return handleChange;
};