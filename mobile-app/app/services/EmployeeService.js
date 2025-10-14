import axios from 'axios';
import AuthService from './auth.services';
import settings from '../../config/settings';

const url = `${settings.apiUrl}/api/v1/employees`;
const baseURL = `${settings.apiUrl}/api/v1/`;
let authAxios = null;

if (AuthService.getCurrentUser()) {
  authAxios = axios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${AuthService.getCurrentUser().userToken}`,
    },
  });
} else {
  authAxios = axios.create({
    baseURL: baseURL,
  });
}

class EmployeeService {
  getEmployees = async () => {
    const result = await authAxios.get('/');
    return result;
    // return axios.get(EMPLOYEE_API_BASE_URL)
  };

  createEmployee = async employee => {
    const result = await authAxios.post('/', employee);
    return result;
  };

  getEmployeeById = async employeeId => {
    const result = await authAxios.get('/' + employeeId);
    return result;
  };

  updateEmployee = async (employee, employeeId) => {
    const result = await authAxios.put(employeeId, employee);
    return result;
  };

  deleteEmployee = async employeeId => {
    const result = await authAxios.delete('/' + employeeId);
    return result;
    // return axios.delete(EMPLOYEE_API_BASE_URL + '/' + employeeId);
  };
}

export default new EmployeeService();
