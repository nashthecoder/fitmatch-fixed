import { DateType } from "react-native-ui-datepicker";
import { Timestamp } from "firebase/firestore";

export const parseDateType = (value: DateType | Timestamp): Date => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }
  // Handle Firestore Timestamp
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  // Assume Dayjs
  if ("toDate" in value && typeof value.toDate === "function") {
    return value.toDate();
  }
  return new Date(); // fallback
};
