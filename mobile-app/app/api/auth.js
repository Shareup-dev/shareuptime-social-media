import client from "./client";

const login = (email, password) => {
  return client.post("api/v1/authenticate", { email, password });
};

export default { login };
