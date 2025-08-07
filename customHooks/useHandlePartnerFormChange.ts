import { useDispatch } from "react-redux";
import { updatePartnerField } from "@/store/slices/partnerSlice";

export const useHandlePartnerFormChange = () => {
  const dispatch = useDispatch();

  const handleChange = (field: string, value: any) => {
    dispatch(updatePartnerField({ field: field as any, value }));
  };

  return handleChange;
};
