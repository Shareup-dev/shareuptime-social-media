import AuthAxios from './authAxios';

class ProfileService {
    // addOptionalEmail = (uid,data) => AuthAxios.put(`users/${uid}/contact_info/set_optional_email`,data);
    addOptionalEmail = (uid,email) => AuthAxios({method:'PUT', url:`users/${uid}/contact_info/set_optional_email`,params:{email}});

    sendOTPtoVerifyEmail = (uid) => AuthAxios.put(`contact_info/send_otp_verify_optional_email/${uid}`)
    // verifyOTP = (uid,otp) => AuthAxios.get(`contact_info/verify_otp_email_verify/${uid}`,otp)
    verifyOTP = (uid,otp) => AuthAxios({method:"GET", url:`contact_info/verify_otp_email_verify/${uid}`,params: {otp}})
    removeOptionalEmail = (uid) =>AuthAxios.delete(`users/${uid}/contact_info/remove_optional_email`)
    makeAsPrimaryEmail = (uid) => AuthAxios.put(`users/${uid}/contact_info/make_optional_email_primary_email`)

    getAllMedia = (uid,config) => AuthAxios.get(`user/media/${uid}`,config);
}

export default new ProfileService();
