const API_URL = "http://localhost:5000/api";

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed.");
  }

  return data; // { token, user }
}

export async function getAdminStats(token) {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load stats.");
  return data;
}

export async function getTeacherClasses(token) {
  const res = await fetch(`${API_URL}/teacher/classes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load classes.");
  return data;
}

export async function getClassStudents(token, classId) {
  const res = await fetch(`${API_URL}/teacher/classes/${classId}/students`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load students.");
  return data;
}

export async function recordPerformance(token, payload) {
  const res = await fetch(`${API_URL}/teacher/performance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to record performance.");
  return data;
}

export async function getStudentMe(token) {
  const res = await fetch(`${API_URL}/student/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load profile.");
  return data;
}

export async function getStudentPerformance(token) {
  const res = await fetch(`${API_URL}/student/performance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load performance.");
  return data;
}

export async function getStudentTimetable(token) {
  const res = await fetch(`${API_URL}/student/timetable`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load timetable.");
  return data;
}

export async function getStudentHolidayQuizzes(token) {
  const res = await fetch(`${API_URL}/student/holiday-quizzes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load quizzes.");
  return data;
}

export async function getParentChildren(token) {
  const res = await fetch(`${API_URL}/parent/children`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load children.");
  return data;
}

export async function getChildPerformance(token, studentId) {
  const res = await fetch(`${API_URL}/parent/children/${studentId}/performance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load performance.");
  return data;
}

export async function getPrincipalOverview(token) {
  const res = await fetch(`${API_URL}/principal/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load overview.");
  return data;
}

export async function getPrincipalClasses(token) {
  const res = await fetch(`${API_URL}/principal/classes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load classes.");
  return data;
}

export async function getWorkerMe(token) {
  const res = await fetch(`${API_URL}/worker/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load profile.");
  return data;
}

export async function getUsers(token, role) {
  const url = role ? `${API_URL}/admin/users?role=${role}` : `${API_URL}/admin/users`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load users.");
  return data;
}

export async function createUser(token, payload) {
  const res = await fetch(`${API_URL}/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create user.");
  return data;
}

export async function setUserActive(token, id, active) {
  const res = await fetch(`${API_URL}/admin/users/${id}/active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ active }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update user.");
  return data;
}

export async function getAdminClasses(token) {
  const res = await fetch(`${API_URL}/admin/classes`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load classes.");
  return data;
}

export async function createClass(token, payload) {
  const res = await fetch(`${API_URL}/admin/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create class.");
  return data;
}

export async function getAdminSubjects(token) {
  const res = await fetch(`${API_URL}/admin/subjects`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load subjects.");
  return data;
}

export async function getAdminTeachers(token) {
  const res = await fetch(`${API_URL}/admin/teachers`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load teachers.");
  return data;
}

export async function createAssignment(token, payload) {
  const res = await fetch(`${API_URL}/admin/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create assignment.");
  return data;
}

// Admin timetable
export async function getAdminTimetable(token, classId) {
  const res = await fetch(`${API_URL}/admin/timetable/${classId}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load timetable.");
  return data;
}
export async function createTimetableSlot(token, payload) {
  const res = await fetch(`${API_URL}/admin/timetable`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create slot.");
  return data;
}

// Teacher assignments
export async function getTeacherAssignments(token) {
  const res = await fetch(`${API_URL}/teacher/assignments`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load assignments.");
  return data;
}
export async function createTeacherAssignment(token, payload) {
  const res = await fetch(`${API_URL}/teacher/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create assignment.");
  return data;
}

// Student assignments
export async function getStudentAssignments(token) {
  const res = await fetch(`${API_URL}/student/assignments`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load assignments.");
  return data;
}
export async function submitAssignment(token, assignmentId) {
  const res = await fetch(`${API_URL}/student/assignments/${assignmentId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to submit.");
  return data;
}

// Admin quizzes
export async function getAdminQuizzes(token) {
  const res = await fetch(`${API_URL}/admin/quizzes`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load quizzes.");
  return data;
}
export async function createQuiz(token, payload) {
  const res = await fetch(`${API_URL}/admin/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create quiz.");
  return data;
}

// Student quiz-taking
export async function getStudentQuiz(token, id) {
  const res = await fetch(`${API_URL}/student/holiday-quizzes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load quiz.");
  return data;
}
export async function attemptQuiz(token, id, answers) {
  const res = await fetch(`${API_URL}/student/holiday-quizzes/${id}/attempt`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ answers }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to submit quiz.");
  return data;
}
