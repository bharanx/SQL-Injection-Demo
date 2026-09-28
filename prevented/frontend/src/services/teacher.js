import api from './api';

export const getTeacherProfile = async () => {
  const response = await api.get('/teacher/profile');
  return response.data;
};

export const getStudents = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.department_id) params.append('department_id', filters.department_id);
  if (filters.year) params.append('year', filters.year);
  if (filters.q) params.append('q', filters.q);
  
  const response = await api.get(`/teacher/students?${params.toString()}`);
  return response.data;
};

export const getStudent = async (studentId) => {
  const response = await api.get(`/teacher/students/${studentId}`);
  return response.data;
};

export const updateStudent = async (studentId, data) => {
  const response = await api.put(`/teacher/students/${studentId}`, data);
  return response.data;
};

export const verifyStudent = async (registerNumber) => {
  const response = await api.get(`/teacher/verify-student?register_number=${encodeURIComponent(registerNumber)}`);
  return response.data;
};

export const getTeacherSubjects = async () => {
  const response = await api.get('/teacher/subjects');
  return response.data;
};

export const enterMarks = async (data) => {
  const response = await api.post('/teacher/marks', data);
  return response.data;
};

export const recordAttendance = async (data) => {
  const response = await api.post('/teacher/attendance', data);
  return response.data;
};

export const createNotice = async (data) => {
  const response = await api.post('/teacher/notices', data);
  return response.data;
};

export const checkBloodDriveStatus = async (registerNumber) => {
  const response = await api.get(`/teacher/blood-drive-status/${encodeURIComponent(registerNumber)}`);
  return response.data;
};
