import { db } from "@/config/firebase"; // Adjust path as needed
import { getAuth } from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const auth = getAuth();

// 1. Send Like
export const sendLike = async (toUserId: string) => {
  try {
    const currentUserId = auth.currentUser?.uid;

    // Validate inputs
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    if (!toUserId || typeof toUserId !== "string") {
      throw new Error("Invalid recipient user ID");
    }

    // Get current user's document
    const currentUserDoc = await getDoc(doc(db, "users", currentUserId));

    if (!currentUserDoc.exists()) {
      throw new Error("Current user document not found");
    }

    const currentUserData = currentUserDoc.data();

    // Check if user is already liked
    if (currentUserData.likes && currentUserData.likes.includes(toUserId)) {
      throw new Error("You already liked this user");
    }

    // Create like record with all required fields
    const likeData = {
      from: currentUserId,
      to: toUserId,
      createdAt: serverTimestamp(),
      matched: false,
    };

    const likeRef = await addDoc(collection(db, "likes"), likeData);

    // Update current user's liked array
    await updateDoc(doc(db, "users", currentUserId), {
      likes: arrayUnion(toUserId),
    });

    // Check for match
    await checkForMatch(currentUserId, toUserId, "like");

    // Create notification
    await createNotification(toUserId, "like");

    return likeRef.id;
  } catch (error) {
    console.error("Error sending like:", error);
    throw error;
  }
};
// 2. Unlike Profile
export const unlikeProfile = async (userId: string) => {
  try {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) throw new Error("User not authenticated");

    // Remove from current user's liked array
    await updateDoc(doc(db, "users", currentUserId), {
      likes: arrayRemove(userId),
    });

    //Delete like record if exists
    const likeQuery = query(
      collection(db, "likes"),
      where("from", "==", currentUserId),
      where("to", "==", userId)
    );

    const likeSnapshot = await getDocs(likeQuery);
    likeSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error unliking profile:", error);
    throw error;
  }
};

// 3. Send SuperLike
export const sendSuperLike = async (toUserId: string) => {
  try {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) throw new Error("User not authenticated");

    // Create superlike record
    const superlikeRef = await addDoc(collection(db, "superlikes"), {
      from: currentUserId,
      to: toUserId,
      createdAt: serverTimestamp(),
      matched: false,
    });

    // Update current user's liked array
    await updateDoc(doc(db, "users", currentUserId), {
      likes: arrayUnion(toUserId),
    });

    // Check for match
    await checkForMatch(currentUserId, toUserId, "superlike");

    // Create notification
    await createNotification(toUserId, "superlike");

    return superlikeRef.id;
  } catch (error) {
    console.error("Error sending superlike:", error);
    throw error;
  }
};

// 4. Send Message Request
export const sendMessageRequest = async (
  toUserId: string,
  messageText: string
) => {
  try {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) throw new Error("User not authenticated");

    // Check if request already exists
    const requestQuery = query(
      collection(db, "messageRequests"),
      where("from", "==", currentUserId),
      where("to", "==", toUserId)
    );

    const requestSnapshot = await getDocs(requestQuery);
    if (!requestSnapshot.empty) {
      throw new Error("Message request already exists");
    }

    // Create message request
    const requestRef = await addDoc(collection(db, "messageRequests"), {
      from: currentUserId,
      to: toUserId,
      message: messageText,
      createdAt: serverTimestamp(),
      accepted: false,
    });

    // Create notification
    await createNotification(toUserId, "request");

    return requestRef.id;
  } catch (error) {
    console.error("Error sending message request:", error);
    throw error;
  }
};

// 5. Helper: Check for Match
const checkForMatch = async (
  currentUserId: string,
  otherUserId: string,
  type: "like" | "superlike"
) => {
  try {
    const collectionName = type === "like" ? "likes" : "superlikes";

    // Check if reciprocal like exists
    const matchQuery = query(
      collection(db, collectionName),
      where("from", "==", otherUserId),
      where("to", "==", currentUserId)
    );

    const matchSnapshot = await getDocs(matchQuery);

    if (!matchSnapshot.empty) {
      // Create match document with sorted user IDs for consistent queries
      const users = [currentUserId, otherUserId].sort();
      const matchData = {
        users,
        userIds: {
          [currentUserId]: true,
          [otherUserId]: true,
        },
        createdAt: serverTimestamp(),
      };

      // Add the match document
      await addDoc(collection(db, "matches"), matchData);

      //Update both like records to mark them as matched
      const batch = writeBatch(db);
      matchSnapshot.forEach((doc) => {
        batch.update(doc.ref, { matched: true });
      });
      await batch.commit();

      // Create match notifications for both users
      await createNotification(otherUserId, "match");
    }
  } catch (error) {
    console.error("Error checking for match:", error);
    throw error;
  }
};

// Helper: Create Notification
const createNotification = async (
  toUserId: string,
  type: "like" | "superlike" | "request" | "match"
) => {
  try {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;

    const notificationsRef = collection(db, "notifications");
    const batch = writeBatch(db);

    // Base notification (from current user to target user)
    const baseNotification = {
      from: currentUserId,
      to: toUserId,
      type,
      createdAt: serverTimestamp(),
      read: false,
    };

    // For match notifications, we need to create two notifications
    if (type === "match") {
      // Notification from current user to other user
      batch.set(doc(notificationsRef), {
        ...baseNotification,
      });

      // Notification from other user to current user
      batch.set(doc(notificationsRef), {
        from: toUserId,
        to: currentUserId,
        type: "match",
        createdAt: serverTimestamp(),
        read: false,
      });
    } else {
      // Regular notification (like, superlike, request)
      batch.set(doc(notificationsRef), baseNotification);
    }

    await batch.commit();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
