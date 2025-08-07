import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '@/store/slices/userSlice';
import { RootState } from '@/store/rootReducer';

export const useHandleFormChange = () => {
  const dispatch = useDispatch();
  const currentUserData = useSelector((state: RootState) => state.user.data);

  const handleChange = (field: string, value: any) => {
    if (currentUserData) {
      dispatch(setUserData({ ...currentUserData, [field]: value }));
    }
  };

  return handleChange;
};