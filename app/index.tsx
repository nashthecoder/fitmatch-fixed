import { firebaseApp } from "@/config/firebase";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import { setCreatingUserData, setUser } from "../store/slices/authSlice";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const creatingUserData = useSelector(
    (state: RootState) => state.auth.creatingUserData
  );

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    dispatch(setCreatingUserData(false));

    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      console.log("Auth state changed >>", currentUser);
      setIsLoading(false);
      dispatch(setUser(currentUser));

      // Unsubscribe immediately if user is found
      if (currentUser) {
        unsubscribe();
      }
    });

    // Cleanup if component unmounts before user is found
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading || creatingUserData) return;
    if (user && !creatingUserData) {
      router.replace("/Auth/ProcessUserData");
    } else {
      router.replace("/Auth/LandingPage");
    }
  }, [user, isLoading, creatingUserData]);

  return null;
}
