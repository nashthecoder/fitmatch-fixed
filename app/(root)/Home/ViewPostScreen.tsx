import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import CheckIcon from "@/components/Icons/CheckIcon";
import CommentsIcon from "@/components/Icons/Posts/CommentsIcon";
import { db } from "@/config/firebase";
import useKeyboardVisible from "@/customHooks/useIsKeyboardVisible";
import { toggleLike } from "@/helpers/firestore";
import { formatNumber } from "@/helpers/formatters";
import { getTimeAgo } from "@/helpers/timeAgo";
import { RootState } from "@/store/rootReducer";
import { Comment, UserPost } from "@/types/post";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Video from "react-native-video";
import { useSelector } from "react-redux";

// ... (keep your icon imports the same)

const ViewPostScreen = () => {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<UserPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const currentUser = getAuth().currentUser;
  const currentUserUid = currentUser?.uid;
  const { bottom } = useSafeAreaInsets();
  const userData = useSelector((state: RootState) => state.user.data);
  const [showComment, setShowComment] = useState(true);
  const isKeyboardVisible = useKeyboardVisible();
  const [isPlaying, setIsPlaying] = useState(false);
  // Video player setup

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !postId || !currentUser) return;
    setShowComment(false);
    try {
      const commentsRef = collection(db, "posts", postId as string, "comments");
      await addDoc(commentsRef, {
        text: newComment.trim(),
        userId: currentUser.uid,
        userInfo: {
          username: (userData?.prenoms || "") + " " + (userData?.nom || ""),
          profilePicUrl: userData?.profilePicUrl || null,
        },
        createdAt: serverTimestamp(),
        likes: {
          by: [],
          count: 0,
        },
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setShowComment(true);
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Image
        source={
          item.userInfo.profilePicUrl
            ? { uri: item.userInfo.profilePicUrl }
            : require("@/assets/images/default-user-picture.png")
        }
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{item.userInfo.username}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.commentTime}>{getTimeAgo(item.createdAt)}</Text>
      </View>
    </View>
  );

  const handleLikePress = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));

      // Update Firestore
      await toggleLike(post!.id, currentUserUid!, !newLiked);
    } catch (error) {
      // Revert UI changes if Firestore update fails
      setLiked(!liked);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      console.error("Failed to update like:", error);
    }
  };
  // Fetch post and comments
  useEffect(() => {
    if (!postId) return;

    // Post listener
    const postRef = doc(db, "posts", postId as string);
    const unsubscribePost = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        const postData = doc.data() as UserPost;
        setPost(postData);
        setLiked(postData.likes.by.includes(currentUser?.uid || ""));
        setLikesCount(postData.likes.count);
      }
    });

    // Comments listener
    const commentsRef = collection(db, "posts", postId as string, "comments");
    const unsubscribeComments = onSnapshot(commentsRef, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(
        commentsData.sort((a: any, b: any) => b.createdAt - a.createdAt)
      );
    });

    return () => {
      unsubscribePost();
      unsubscribeComments();
      //   player.pause();
    };
  }, [postId]);

  // ... (keep your handleLikePress and handleCommentSubmit functions the same)

  const togglePlayback = () => {};

  const renderMedia = () => {
    if (!post?.mediaUrl || !post.mediaType) return null;

    if (post.mediaType === "photo") {
      return (
        <Image
          source={{ uri: post.mediaUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      );
    }

    return (
      <View style={styles.videoContainer}>
        <Video style={styles.video} source={{ uri: post?.mediaUrl }} />
        {!isPlaying && (
          <TouchableOpacity onPress={togglePlayback}>
            <Text>▶</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // ... (keep your renderComment function the same)

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading post...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={8}
          >
            <BackBTNIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Publication</Text>
        </View>
        <KeyboardAwareScrollView className="flex-1">
          {/* Post Content */}
          <View style={styles.postContainer}>
            {/* User info */}
            <View style={styles.userInfo}>
              <Image
                source={
                  post.posterInfo.profilePicUrl
                    ? { uri: post.posterInfo.profilePicUrl }
                    : require("@/assets/images/default-user-picture.png")
                }
                style={styles.avatar}
              />
              <View>
                <Text style={styles.username}>{post.posterInfo.username}</Text>
                <Text style={styles.postTime}>
                  {getTimeAgo(post?.createdAt)}
                </Text>
              </View>
              {post.posterInfo.verified && <CheckIcon />}
            </View>

            {/* Post text */}
            {post.text && <Text style={styles.postText}>{post.text}</Text>}

            {/* Media */}
            {renderMedia()}

            {/* Like/comment/share */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLikePress}
              >
                {liked ? (
                  <AntDesign name="heart" color={"red"} size={17} />
                ) : (
                  <AntDesign name="hearto" color={"white"} size={17} />
                )}
                <Text style={styles.actionCount}>
                  {formatNumber(likesCount)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <CommentsIcon />
                <Text style={styles.actionCount}>
                  {formatNumber(comments.length)}
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.actionButton}>
                <ShareIcon />
              </TouchableOpacity> */}
            </View>
          </View>

          {/* Comments List */}
          {comments.map((item) => (
            <View key={item.id} style={styles.commentContainer}>
              <Image
                source={
                  item.userInfo.profilePicUrl
                    ? { uri: item.userInfo.profilePicUrl }
                    : require("@/assets/images/default-user-picture.png")
                }
                style={styles.commentAvatar}
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>
                  {item.userInfo.username}
                </Text>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentTime}>
                  {getTimeAgo(item?.createdAt)}
                </Text>
              </View>
            </View>
          ))}
        </KeyboardAwareScrollView>
        {/* Comment Input */}
        {isKeyboardVisible && (
          <View
            style={[
              styles.commentInputContainer,
              {
                position: "absolute",
                marginBottom: 0,
                bottom: 0,
                left: 0,
                right: 0,
              },
            ]}
          >
            <TextInput
              style={{
                flex: 1,
                backgroundColor: "#2a2a2a",
                color: "white",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 10,
                marginRight: 12,
                maxHeight: 100,
              }}
              placeholder="Ajouter un commentaire..."
              value={showComment ? newComment : ""}
              onChangeText={setNewComment}
              multiline
              className="text-white"
              placeholderTextColor={"rgba(255,255,255,0.5)"}
            />
            <TouchableOpacity
              style={styles.commentButton}
              onPress={handleCommentSubmit}
              disabled={!newComment.trim()}
            >
              <Text style={styles.commentButtonText}>Publier</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
      <View style={[styles.commentInputContainer, { marginBottom: -16 }]}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#2a2a2a",
            color: "white",
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginRight: 12,
            maxHeight: 100,
          }}
          placeholder="Ajouter un commentaire..."
          value={showComment ? newComment : ""}
          onChangeText={setNewComment}
          multiline
          className="text-white"
          placeholderTextColor={"rgba(255,255,255,0.5)"}
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={handleCommentSubmit}
          disabled={!newComment.trim()}
        >
          <Text style={styles.commentButtonText}>Publier</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  postContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  postTime: {
    color: "gray",
    fontSize: 12,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  postText: {
    color: "white",
    fontSize: 15,
    lineHeight: 20,
    marginHorizontal: 16,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
  },
  video: {
    flex: 1,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    marginHorizontal: 8,
    alignSelf: "flex-end",
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionCount: {
    color: "white",
    marginLeft: 4,
    fontSize: 14,
  },
  commentsContainer: {
    flex: 1,
    backgroundColor: "#121212",
  },
  commentsList: {
    paddingBottom: 80, // Space for input
  },
  commentContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  commentText: {
    color: "white",
    fontSize: 14,
    marginVertical: 4,
  },
  commentTime: {
    color: "gray",
    fontSize: 12,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1e1e1e",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    zIndex: 10,
  },
  commentButton: {
    padding: 8,
  },
  commentButtonText: {
    color: "#CD2020",
    fontWeight: "bold",
  },
});

export default ViewPostScreen;
