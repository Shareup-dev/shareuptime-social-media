import AuthAxios from './authAxios';

class GroupService {
  // main actions
  createGroup = (oid, data) => AuthAxios.post(`groups/${oid}/create`, data);
  deleteGroup = (oid, gid) => AuthAxios.delete(`groups/${oid}/delete/${gid}`);
  getGroupById = (gid) => AuthAxios.get(`groups/id/${gid}`);
  getAllGroups = () => AuthAxios.get(`groups`);
  groupSuggestion = (uid) => AuthAxios.get(`groups/suggestion/${uid}`);
  addGroupImage = (gid, data) => AuthAxios.post(`groups/upload_image/${gid}`, data);
  editGroup = (gid, data) => AuthAxios.put(`groups/${gid}/edit_group`, data);

  search = (keyword) =>
    AuthAxios({
      url: `groups/search`,
      method: 'GET',
      params: { keyword },
    });

  // group Admin
  addAdmin = (gid, aid) => AuthAxios.post(`groups/${gid}/add_admin/${aid}`);
  getGroupsOfOwner = (oid) => AuthAxios.get(`groups/group_id/${oid}`);
  getAdmins = (gid) => AuthAxios.get(`groups/${gid}/list_admins`);

  // members
  getMembers = (gid) => AuthAxios.get(`groups/${gid}/members`);
  getUserGroups = (email) => AuthAxios.get(`${email}/groups`);
  leavegroup = (uid, gid) => AuthAxios.delete(`groups/${uid}/leave/${gid}`);
  checkIsMember = (gid, uid) => AuthAxios.get(`groups/${uid}/is_member/${gid}`);
  addMember = (uid, gid) => AuthAxios.post(`groups/${uid}/join/${gid}`);
  deleteMember = (aid, uid, gid) => AuthAxios.delete(`groups/${aid}/${gid}/delete/${uid}`);

  searchMembers = (keyword, gid) =>
    AuthAxios({
      method: 'GET',
      url: 'groups/members_search',
      params: {
        keyword,
        gid,
      },
    });

  // join requests
  joinRequest = (uid, gid) => AuthAxios.post(`groups/${uid}/Join_group/${gid}`);
  acceptMemberRequest = (rid) => AuthAxios.put(`groups/accept_member_requests/${rid}`);
  rejectMemberRequest = (rid) => AuthAxios.put(`groups/reject_member_requests/${rid}`);
  listOfRequests = (gid) => AuthAxios.get(`groups/${gid}/member_requests`);

  // post
  getPostByUserId = (uid) => AuthAxios.get(`groups/posts_user_group/${uid}`);
  getGroupPost = (gid) => AuthAxios.get(`groups/posts/${gid}`);

  // invitations
  inviteToJoin = (gid, uid, fid) => AuthAxios.post(`groups/${gid}/${uid}/invite/${fid}`);
  acceptInvitation = (rid) => AuthAxios.put(`groups/accept_invite/${rid}`);
  rejectInvitation = (rid) => AuthAxios.put(`groups/reject_invite/${rid}`);
}

export default new GroupService();
