import AuthAxios from './authAxios';

class Story {
  addStory = (userId, data) => AuthAxios.post(`/stories/${userId}`, data);
  getStories = () => AuthAxios.get(`/stories`);
  getStoriesByEmail = (email) => AuthAxios.get(`stories/${email}`);
  updateStory = (sid) => AuthAxios.put(`stories/${sid}`, data);
  deleteStory = (sid) => AuthAxios.delete(`stories/${sid}`);
  getViewsCount = (sid) => AuthAxios.get(`stories/views/${sid}`, data);
  // getStoriesOfFriends = (uid) => AuthAxios.get(`stories/friends_stories/${uid}`)
  getStoriesOfFriends = (uid) => AuthAxios.get(`stories/friends_stories_new/${uid}`);
  getStoryAddViews = (sid, uid) => AuthAxios.get(`stories/get_story_add_views/${sid}/${uid}`);
}
export default new Story();
