import React, { useState } from 'react';
import axios, { Axios } from 'axios';
import AuthAxios from './authAxios';


class SwapService {
    getAllSwap = () =>
        AuthAxios.get(`swaps`)
    createSwap = (uid, data) =>
        AuthAxios.post(`swaps/${uid}`, data)
    deleteSwap = (sid) =>
        AuthAxios.delete(`swaps/delete/${sid}`)
    getSwapById = (sid) =>
        AuthAxios.get(`swap/${sid}`)
    getFriendsSwap = (friendEmail) =>
        AuthAxios.get(`swaps/femail/${friendEmail}`)
    getSwapByEmail = (email) =>
        AuthAxios.get(`swaps/email/${email}`)
    editSwap = (sid, data) =>
        AuthAxios.put(`swaps/update/${sid}`, data)
    /*******Comment *******/
    createSwapcomment = (uid, sid, data) =>
        AuthAxios.post(`comment/swap/${uid}/${sid}`, data)
    getSwapComment = (sid) =>
        AuthAxios.get(`comment/swap/${sid}`)
    likePost = (uid, pid, emoji) =>
        AuthAxios.put(`swaps/${uid}/like-unlike/${pid}`, { emoji: emoji });
    getSavedPost = uid => AuthAxios.get(`${uid}/getSavedSwaps`);
}
export default new SwapService();