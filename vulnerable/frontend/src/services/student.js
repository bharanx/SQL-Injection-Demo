import api from './api';

export const getStudentProfile = async () => {
  const response = await api.get('/student/profile');
  return response.data;
};

export const updateStudentProfile = async (data) => {
  const response = await api.put('/student/profile', data);
  return response.data;
};

export const getStudentSubjects = async () => {
  const response = await api.get('/student/subjects');
  return response.data;
};

export const getStudentMarks = async (semester = null) => {
  const url = semester ? `/student/marks?semester=${semester}` : '/student/marks';
  const response = await api.get(url);
  return response.data;
};

export const searchStudentMarks = async (registerNumber) => {
  const response = await api.get(`/student/marks/search?register_number=${encodeURIComponent(registerNumber)}`);
  return response.data;
};

export const getStudentAttendance = async (semester = null) => {
  const url = semester ? `/student/attendance?semester=${semester}` : '/student/attendance';
  const response = await api.get(url);
  return response.data;
};

export const getStudentNotices = async () => {
  const response = await api.get('/student/notices');
  return response.data;
};

export const getNoticeById = async (noticeId) => {
  const response = await api.get(`/student/notices/${noticeId}`);
  return response.data;
};

export const checkEligibility = async (subjectCode) => {
  const response = await api.get(`/student/check-eligibility?subject_code=${encodeURIComponent(subjectCode)}`);
  return response.data;
};

export const reportIssue = async (data) => {
  const response = await api.post('/student/report-issue', data);
  return response.data;
};


