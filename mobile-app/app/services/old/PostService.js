import axios from 'axios';
import settings from '../../config/settings';
import AuthService from './auth.services';

const servers_api = 'http://192.168.100.2:8080';
const my_api = 'http://192.168.100.239:8080';
const baseURL = `${settings.apiUrl}`;
let authAxios = null;

const authenticate = async () => {
  await AuthService.getCurrentUser().then(
    res => {

      authAxios = axios.create({
        baseURL: `${baseURL}/api/v1/`,
        headers: {
          Authorization: `Bearer ${res.userToken}`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    },
    error => {
      console.error(error);
    },
  );
};
authenticate();

class PostService {
  getPosts = async () => {
    authenticate();
    const result = await authAxios.get('posts/');
    return result;
  };

  getNewsFeed = async email => {
    authenticate();
    try {
      const result = await authAxios.get('newsFeed/' + email);
      return result;
    } catch (error) {
      console.error('error occurred while getting newsfeed: ', error);
      return error;
    }
  };

  getPostsForUser = async email => {
    authenticate();
    try {
      const result = await authAxios.get('/posts/email/' + email);
      return result;
    } catch (error) {
      console.error('error occurred while getting posts for user: ', error);
      return error;
    }
  };

  //ToDO: Create a api to get a post by id.
  getPostById = async postId => {
    authenticate();
    const result = await authAxios.get(`posts/post-by-id/${postId}`);
    return result;
  };

  getSavedPostForUser = async email => {
    authenticate();
    const result = await authAxios.get(`posts/${email}/saved_posts`);
    return result;
  };

  createPost = async (userId, content) => {
    const formData = this.createPostFormData(content);

    const result = await authAxios.post(`posts/${userId}`, formData);
    return result;
  };

  updatePost = async (postId, post) => {
    const result = await authAxios.put(`posts/${postId}`, post);
    return result;
  };

  deletePost = async postid => {
    const result = await authAxios.delete(`posts/${postid}`);
    return result;
  };

  addComment = async (userid, postid, comment) => {
    let newComment = {
      content: comment.content,
    };
  

    try {
      const result = await authAxios.post(
        `comment/${userid}/${postid}`,
        newComment,
      );
      return result;
    } catch (error) {
      console.error('Error occurred while posting comment: ', error);
    }
  };

  deleteComment = async commentid => {
    const result = await authAxios.delete(`comment/${commentid}`);
    return result;
  };

  createSwapPost = async (userId, content) => {
    const formData = this.createPostFormData(content);

    const result = await authAxios.post(`swaps/${userId}`, formData);
    return result;
  };
  getSwapComment = async swapId => {
    const result = await authAxios.get(`/comment/swap/${swapId}`);
    return result;
  };
  addSwapComment = async (userId, swapId, commentText) => {
  
    let commentData = new FormData();
    commentData.append('commentText', commentText);
    const result = await authAxios.post(
      `/comment/swap/${userId}/${swapId}`,
      commentData,
    );
    return result;
  };
  getSwapById = async swapId => {
    const result = await authAxios.get(`/swap/${swapId}`);
    return result;
  };

  createPostFormData = content => {
    const formData = new FormData();

    formData.append('content', content.text);

    if (content.images.length !== 0) {


      content.images.forEach(image => {
        const splitPathArr = image.split('/');

        formData.append(`files`, {
          name: splitPathArr.slice(-1).pop(),
          type: 'image/jpg',
          uri: image,
        });
      });
    }

    if (content.groupId) {
      formData.append('groupid', content.groupId);
    }


    return formData;
  };
}

export default new PostService();
