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
