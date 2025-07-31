import { db, firebaseApp } from "@/config/firebase";
import { PartnerData } from "@/store/slices/partnerSlice";
import { UserData } from "@/store/slices/userSlice";
import * as VideoThumbnails from "expo-video-thumbnails";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

export const getCurrentAuthenticatedUser = () => {
  const auth = getAuth(firebaseApp);
  return auth.currentUser;
};

export const createUserIfNotExists = async (
  userType: string,
  userData: UserData
) => {
  const currentUser = getCurrentAuthenticatedUser();
  if (!currentUser) return;

  const db = getFirestore(firebaseApp);
  const userRef = doc(db, "users", currentUser.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const newUser = {
      ...userData,
      email: currentUser.email,
      createdAt: serverTimestamp(),
      userType,
      acceptCGU: true,
      quizCompleted: false,
      personalData: true,
    };

    try {
      await setDoc(userRef, newUser);
    } catch (error) {
      console.error("Firestore write error:", error);
    }
  }
};

export const getQuizCompleted = async (): Promise<boolean | null> => {
  const currentUser = getCurrentAuthenticatedUser();
  if (!currentUser) return null;

  const userRef = doc(getFirestore(firebaseApp), "users", currentUser.uid);
  const docSnap = await getDoc(userRef);

  return docSnap.exists() ? docSnap.data()?.quizCompleted ?? false : null;
};

export const getCurrentUserData = async (): Promise<UserData | null> => {
  try {
    const user = getCurrentAuthenticatedUser();
    if (!user) throw new Error("No authenticated user");

    const db = getFirestore(firebaseApp);
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    return docSnap.exists() ? (docSnap.data() as UserData) : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const uploadUserImage = async (
  imageUri: string,
  type: "profile" | "cover"
) => {
  try {
    const user = getCurrentAuthenticatedUser();
    if (!user) throw new Error("No authenticated user");

    const uid = user.uid;
    const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
    const storage = getStorage(firebaseApp);
    const imageRef = ref(storage, `users/${uid}/${type}/${filename}`);

    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    const previousUrl = userDoc.exists()
      ? userDoc.data()?.[`${type}PicUrl`]
      : null;

    if (previousUrl) {
      try {
        const previousRef = ref(storage, previousUrl);
        await deleteObject(previousRef);
      } catch (err: any) {
        console.warn("Previous image deletion failed:", err.message);
      }
    }

    const response = await fetch(imageUri);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    const downloadURL = await getDownloadURL(imageRef);

    await updateDoc(userDocRef, {
      [`${type}PicUrl`]: downloadURL,
    });
  } catch (e: any) {
    console.log("Image upload error:", e);
  }
};

export const updatePartnerData = async (data: Partial<UserData>) => {
  try {
    const user = getCurrentAuthenticatedUser();
    if (!user) throw new Error("No authenticated user found.");

    const userRef = doc(getFirestore(firebaseApp), "users", user.uid);
    await updateDoc(userRef, data);
  } catch (error: any) {
    console.error("Firestore update error:", error);
  }
};

export const updateUserData = async (
  data: Partial<UserData>,
  options = { merge: true }
): Promise<void> => {
  const user = getCurrentAuthenticatedUser();
  if (!user) return;

  const db = getFirestore(firebaseApp);
  const userRef = doc(db, "users", user.uid);

  try {
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, updateData, options);
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
};

export const uploadVideoChallenge = async (videoUri: string) => {
  try {
    const user = getCurrentAuthenticatedUser();
    if (!user) throw new Error("No authenticated user");

    const uid = user.uid;
    const filename = videoUri.substring(videoUri.lastIndexOf("/") + 1);
    const storage = getStorage(firebaseApp);
    const db = getFirestore(firebaseApp);

    const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      { time: 1000 }
    );

    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    const previousVideoData = userDoc.exists()
      ? userDoc.data()?.videoChallenge
      : null;

    if (previousVideoData) {
      try {
        if (previousVideoData.videoUri) {
          await deleteObject(ref(storage, previousVideoData.videoUri));
        }
        if (previousVideoData.thumbnailUri) {
          await deleteObject(ref(storage, previousVideoData.thumbnailUri));
        }
      } catch (err: any) {
        console.warn("Previous video deletion failed:", err.message);
      }
    }

    const videoRef = ref(
      storage,
      `users/${uid}/videoChallenge/video_${Date.now()}.mp4`
    );
    const videoBlob = await (await fetch(videoUri)).blob();
    await uploadBytes(videoRef, videoBlob);
    const videoUrl = await getDownloadURL(videoRef);

    const thumbnailRef = ref(
      storage,
      `users/${uid}/videoChallenge/thumbnail_${Date.now()}.jpg`
    );
    const thumbnailBlob = await (await fetch(thumbnailUri)).blob();
    await uploadBytes(thumbnailRef, thumbnailBlob);
    const thumbnailUrl = await getDownloadURL(thumbnailRef);

    await updateDoc(userDocRef, {
      videoChallenge: {
        videoUri: videoUrl,
        thumbnailUri: thumbnailUrl,
        uploadedAt: new Date().toISOString(),
      },
    });

    return { videoUrl, thumbnailUrl };
  } catch (e: any) {
    console.error("Video upload error:", e);
    throw e;
  }
};

export const uploadMediaAsync = async (
  uri: string,
  path: string
): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("🔥 uploadMediaAsync failed:", error);
    throw new Error("Media upload failed");
  }
};

export const toggleLike = async (
  postId: string,
  userId: string,
  isLiked: boolean
) => {
  const postRef = doc(db, "posts", postId);

  try {
    if (isLiked) {
      // Unlike - remove user from likes array
      await updateDoc(postRef, {
        "likes.by": arrayRemove(userId),
        "likes.count": increment(-1),
      });
    } else {
      // Like - add user to likes array
      // First ensure the likes.by array exists
      await updateDoc(postRef, {
        "likes.by": arrayUnion(userId),
        "likes.count": increment(1),
        // Initialize if missing:
        ...(await getDoc(postRef).then(
          (doc) =>
            !doc.get("likes.by") && {
              "likes.by": [userId],
            }
        )),
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

export const getOrCreateChat = async (otherUserId: string) => {
  const currentUser = getAuth().currentUser;
  if (!currentUser) throw new Error("User not authenticated");

  // Create chat ID by combining user IDs in alphabetical order
  const participants = [currentUser.uid, otherUserId].sort();
  const chatId = participants.join("_");

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    // Create new chat
    await setDoc(chatRef, {
      participants,
      lastMessage: {
        text: "Chat started",
        senderId: currentUser.uid,
        createdAt: new Date(),
        read: false,
      },
    });
  }

  return chatId;
};

export const sendMessage = async (
  chatId: string,
  text: string,
  otherUserId: string
) => {
  const currentUser = getAuth().currentUser;
  if (!currentUser) throw new Error("User not authenticated");

  // Add message to subcollection
  await addDoc(collection(db, "chats", chatId, "messages"), {
    text,
    senderId: currentUser.uid,
    createdAt: new Date(),
    read: false,
  });

  // Update last message in chat document
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: {
      text,
      senderId: currentUser.uid,
      createdAt: new Date(),
      read: false,
    },
  });

  // You might want to update the other user's FCM token here for push notifications
};

export const createPartnerIfNotExists = async (
  partnerData: PartnerData
) => {
  const currentUser = getCurrentAuthenticatedUser();
  if (!currentUser) return;

  const db = getFirestore(firebaseApp);
  const partnerRef = doc(db, "partenaires", currentUser.uid);
  const docSnap = await getDoc(partnerRef);

  if (!docSnap.exists()) {
    const newPartner = {
      ...partnerData,
      email: currentUser.email,
      createdAt: serverTimestamp(),
      isValid: false,
      acceptCGU: true,
    };

    try {
      await setDoc(partnerRef, newPartner);
      return newPartner;
    } catch (error) {
      console.error("Firestore partner write error:", error);
      throw error;
    }
  }
  return docSnap.data();
};

export const uploadPartnerImages = async (images: any[]) => {
  try {
    const user = getCurrentAuthenticatedUser();
    if (!user) throw new Error("No authenticated user");

    console.log("🔥 uploadPartnerImages - Starting upload for", images.length, "images");

    const uploadPromises = images.map(async (image, index) => {
      const filename = `${Date.now()}-${index}.jpg`;
      const storage = getStorage(firebaseApp);
      const imageRef = ref(storage, `partenaires/${user.uid}/images/${filename}`);

      console.log(`🔥 uploadPartnerImages - Uploading image ${index + 1}:`, image.uri);
      
      const response = await fetch(image.uri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);
      console.log(`🔥 uploadPartnerImages - Image ${index + 1} uploaded successfully:`, downloadURL);
      
      return downloadURL;
    });

    const results = await Promise.all(uploadPromises);
    console.log("🔥 uploadPartnerImages - All uploads completed:", results);
    return results;
  } catch (error) {
    console.error("🔥 uploadPartnerImages - Upload error:", error);
    throw error;
  }
};

export const uploadPartnerVideos = async (videos: any[]) => {
  try {
    const user = getCurrentAuthenticatedUser();
    if (!user) throw new Error("No authenticated user");

    const uploadPromises = videos.map(async (video, index) => {
      const filename = `${Date.now()}-${index}.mp4`;
      const storage = getStorage(firebaseApp);
      const videoRef = ref(storage, `partenaires/${user.uid}/videos/${filename}`);

      const response = await fetch(video.uri);
      const blob = await response.blob();
      await uploadBytes(videoRef, blob);

      return await getDownloadURL(videoRef);
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Partner videos upload error:", error);
    throw error;
  }
};

export const updatePartnerDataFirestore = async (data: Partial<PartnerData>) => {
  try {
    const user = getCurrentAuthenticatedUser();
    if (!user) throw new Error("No authenticated user found.");

    console.log("🔥 updatePartnerDataFirestore - Updating with data:", data);
    
    const partnerRef = doc(getFirestore(firebaseApp), "partenaires", user.uid);
    await updateDoc(partnerRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    
    console.log("🔥 updatePartnerDataFirestore - Update successful");
  } catch (error: any) {
    console.error("🔥 updatePartnerDataFirestore - Error:", error);
    throw error;
  }
};

export const getCurrentPartnerData = async (): Promise<PartnerData | null> => {
  try {
    const user = getCurrentAuthenticatedUser();
    if (!user) throw new Error("No authenticated user");

    const db = getFirestore(firebaseApp);
    const partnerRef = doc(db, "partenaires", user.uid);
    const docSnap = await getDoc(partnerRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as PartnerData;
      console.log("🔥 getCurrentPartnerData - Retrieved from Firestore:", {
        titre: data.titre,
        imageUrl: data.imageUrl,
        imagesCount: data.images?.length || 0,
        images: data.images?.slice(0, 2) || [] // Show first 2 image URLs for debugging
      });
      return data;
    } else {
      console.log("🔥 getCurrentPartnerData - No document found in Firestore");
      return null;
    }
  } catch (error) {
    console.error("🔥 getCurrentPartnerData - Error fetching partner data:", error);
    return null;
  }
};

export const checkUserType = async (): Promise<"binome" | "partner" | null> => {
  try {
    const user = getCurrentAuthenticatedUser();
    if (!user) return null;

    const db = getFirestore(firebaseApp);
    
    // Check if user exists in users collection (binome)
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return "binome";
    }
    
    // Check if user exists in partenaires collection (partner)
    const partnerRef = doc(db, "partenaires", user.uid);
    const partnerSnap = await getDoc(partnerRef);
    
    if (partnerSnap.exists()) {
      return "partner";
    }
    
    return null;
  } catch (error) {
    console.error("Error checking user type:", error);
    return null;
  }
};
