// helpers/timeAgo.ts
import dayjs from "dayjs";
import "dayjs/locale/fr"; // Import French locale
import relativeTime from "dayjs/plugin/relativeTime";
import { Timestamp } from "firebase/firestore";

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.locale("fr"); // Set French as default locale

export const getTimeAgo = (timestamp: Timestamp) => {
  return dayjs(timestamp?.toDate()).fromNow(); // Will now output in French
};

export const calculateAge = (timestamp: Timestamp): number => {
  const birthDate = dayjs(timestamp.toDate());
  return dayjs().diff(birthDate, "year");
};
