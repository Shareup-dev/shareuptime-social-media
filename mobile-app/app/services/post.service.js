import AuthAxios from './authAxios';

class PostService {
  getNewsFeed = (email) => AuthAxios.get(`new_newsFeed/${email}`);
  createPost = (uid, data) => AuthAxios.post(`posts/${uid}`, data, config);
  getPostByEmail = (email) => AuthAxios.get(`posts/email/${email}`);
  getPostByPostId = (pid) => AuthAxios.get(`posts/post-by-id/${pid}`);
  getSavedPost = (email) => AuthAxios.get(`posts/${email}/saved_posts`);
  deletePost = (postId) => AuthAxios.delete(`posts/${postId}`);
  editPost = (postId) => AuthAxios.put(`posts/${postId}`);
  getPosts = () => AuthAxios.get(`posts`);
  likePost = (uid, pid, emoji) =>
    AuthAxios.put(`posts/${uid}/like-unlike/${pid}`, { emoji: emoji });
  savePost = (uid, pid) => AuthAxios.put(`posts/${uid}/save-unsave/${pid}`);

  /******************** COMMENT *******************/
  addComment = (userid, postid, comment) => AuthAxios.post(`comment/${userid}/${postid}`, comment);
  deleteComment = (commentid) => AuthAxios.delete(`comment/${commentid}`);
  replay = (uid, commentId, data) => AuthAxios.post(`reply/${uid}/${commentId}`, data);
  likeUnlikeComment = (uid, cid, params) =>
    AuthAxios.put(`comment/${uid}/like-unlike/${cid}`, params);
  likeUnlikeReply = (uid, rid, params) => AuthAxios.put(`reply/${uid}/like-unlike/${rid}`, params);
  editComment = (cid) => AuthAxios.put(`comment/Edit_comment/${cid}`);
  getAllComments = (pid) => AuthAxios.get(`comment/get_comment/${pid}`);
  getAllReply = (cid) => AuthAxios.get(`comment/get_replies/${cid}`);
}
const config = {
  onUploadProgress: (progressEvent) => {
    // no-op: track progress if needed
    const _ = (progressEvent.loaded / progressEvent.total) * 50;
  },
  onDownloadProgress: (progressEvent) => {
    // no-op: track progress if needed
    const _ = 50 + (progressEvent.loaded / progressEvent.total) * 50;
  },
};
export default new PostService();
