import AuthAxios from "./authAxios";

class ReelService {
  getAllReels = () => AuthAxios.get(`/api/v1/reels`); 
  addComment = (uid,rid,comment) => AuthAxios.post(`/api/v1/comment_on_reel/${uid}/${rid}`,comment);
  addReel = (uid,reel) => AuthAxios.post(`/api/v1/reels/${uid}`,reel);
  getReelsByUser = (uid) => AuthAxios.get(`/api/v1/reels/user/${uid}`);
  getReelById = (rid) => AuthAxios.get(`/api/v1/reels/reel-by-id/${rid}`);
}

export default new ReelService();
