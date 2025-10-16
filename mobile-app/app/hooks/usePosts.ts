import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  useGetFeedPostsQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
} from '../redux/api';
import {
  setFeedPosts,
  addFeedPost,
  toggleLike,
  incrementCommentCount,
} from '../redux/feedPostsSlice';

interface CreatePostData {
  content: string;
  media?: File[];
  location?: string;
  feeling?: string;
  tags?: string[];
}

interface CreateCommentData {
  postId: string;
  content: string;
  parentId?: string;
}

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const { posts, isLoading, error } = useAppSelector((state) => state.feedPosts);

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // RTK Query hooks
  const {
    data: feedData,
    isLoading: isFeedLoading,
    error: feedError,
    refetch: refetchFeed,
  } = useGetFeedPostsQuery({ page, limit: 10 });

  const [createPostMutation, { isLoading: isCreatingPost }] = useCreatePostMutation();
  const [likePostMutation, { isLoading: isLikingPost }] = useLikePostMutation();
  const [createCommentMutation] = useCreateCommentMutation();

  // Feed operations
  const refreshFeed = useCallback(async () => {
    try {
      setRefreshing(true);
      setPage(1);
      await refetchFeed();
    } catch (error) {
      console.error('Error refreshing feed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchFeed]);

  const loadMorePosts = useCallback(() => {
    if (!isFeedLoading) {
      setPage((prev) => prev + 1);
    }
  }, [isFeedLoading]);

  // Post creation
  const createPost = async (postData: CreatePostData) => {
    try {
      const formData = new FormData();
      formData.append('content', postData.content);

      if (postData.location) {
        formData.append('location', postData.location);
      }

      if (postData.feeling) {
        formData.append('feeling', postData.feeling);
      }

      if (postData.tags?.length) {
        formData.append('tags', JSON.stringify(postData.tags));
      }

      if (postData.media?.length) {
        postData.media.forEach((file, index) => {
          formData.append(`media`, file);
        });
      }

      const result = await createPostMutation(formData).unwrap();

      if (result) {
        dispatch(addFeedPost(result));
        return { success: true, post: result };
      }

      throw new Error('Failed to create post');
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to create post';
      return { success: false, error: errorMessage };
    }
  };

  // Like operations
  const likePost = async (postId: string) => {
    try {
      // Optimistic update
      dispatch(toggleLike(postId));

      const result = await likePostMutation(postId).unwrap();

      return { success: true, result };
    } catch (err: any) {
      // Revert optimistic update on error
      dispatch(toggleLike(postId));

      const errorMessage = err?.data?.message || err?.message || 'Failed to like post';
      return { success: false, error: errorMessage };
    }
  };

  // Comment operations
  const addComment = async (commentData: CreateCommentData) => {
    try {
      const result = await createCommentMutation(commentData).unwrap();

      if (result) {
        dispatch(incrementCommentCount(commentData.postId));
        return { success: true, comment: result };
      }

      throw new Error('Failed to add comment');
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to add comment';
      return { success: false, error: errorMessage };
    }
  };

  // Get comments for a specific post
  const usePostComments = (postId: string) => {
    return useGetPostCommentsQuery(postId, {
      skip: !postId,
    });
  };

  return {
    // State
    posts,
    isLoading: isLoading || isFeedLoading,
    isCreatingPost,
    isLikingPost,
    error: error || feedError,
    refreshing,

    // Feed operations
    refreshFeed,
    loadMorePosts,

    // Post operations
    createPost,
    likePost,
    addComment,

    // Comments
    usePostComments,

    // Data
    feedData,
  };
};
