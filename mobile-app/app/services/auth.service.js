import axios from 'axios';
import settings from '../config/settings';

const url = settings.apiUrl + '/api/v1';

class AuthService {
  login = (username, password) =>
    axios({
      method: 'POST',
      url: `${url}/users/authenticate`,
      data: {username, password},
    });

  signup = user =>
    axios({
      method: 'POST',
      url: `${url}/register`,
      data: user,
    });

  verifyUser = username =>
    axios({
      method: 'GET',
      url: `${url}/users/email/${username}`,
    });

  passwordResetOTP = username =>
    axios({
      method: 'PUT',
      url: `${url}/send_otp/${username}`,
    });

  verifyPasswordResetOTP = (username, otp) =>
    axios({
      method: 'GET',
      url: `${url}/verify_otp_reset_password/${username}`,
      params: {
        otp,
      },
    });

  verifyEmailOTP = username =>
    axios({
      method: 'PUT',
      url: `${url}/send_otp_verify_email/${username}`,
    });
  verifyEmailConfirmOTP = (username, otp) =>
    axios({
      method: 'GET',
      url: `${url}/verify_otp_email_verify/${username}`,
      params: {
        otp,
      },
    });

  resetPassword = (username, newPassword) =>
    axios({
      method: 'PUT',
      url: `${url}/reset_password/${username}`,
      params: {
        password: newPassword,
      },
    });
}

export default new AuthService();
