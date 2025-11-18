const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

const buildUrl = (path, params) => {
  const url = new URL(`${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      url.searchParams.append(key, value);
    });
  }
  return url;
};

const request = async (path, { method = "GET", params, body } = {}) => {
  const url = buildUrl(path, params);
  const options = { method, headers: {} };

  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Une erreur est survenue");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const createEntityClient = (resource) => ({
  list: (sort, limit) =>
    request(`/${resource}`, { params: { sort, limit } }),
  filter: (filters = {}, sort, limit) =>
    request(`/${resource}`, { params: { ...filters, sort, limit } }),
  get: (id) => request(`/${resource}/${id}`),
  create: (data) => request(`/${resource}`, { method: "POST", body: data }),
  update: (id, data) =>
    request(`/${resource}/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/${resource}/${id}`, { method: "DELETE" }),
});

const uploadFile = async ({ file }) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Erreur lors du téléchargement");
  }

  return response.json();
};

export const base44 = {
  entities: {
    Product: createEntityClient("products"),
    Category: createEntityClient("categories"),
    Order: createEntityClient("orders"),
    SiteSettings: createEntityClient("settings"),
  },
  auth: {
    me: () => request("/auth/me"),
    logout: () => request("/auth/logout", { method: "POST" }),
  },
  integrations: {
    Core: {
      UploadFile: uploadFile,
      SendEmail: (payload) =>
        request("/integrations/email", { method: "POST", body: payload }),
    },
  },
};

