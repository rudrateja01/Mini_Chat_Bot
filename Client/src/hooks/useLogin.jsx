import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const useLogin = () => {
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (EmailID, password) => {
  try {
    const res = await fetch("https://mini-chat-bot-sv7z.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: EmailID, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return null;
    }

    if (res.ok) {
      const userWithToken = { ...data.user, token: data.token };

      // Saving in localStorage
      localStorage.setItem("user", JSON.stringify(userWithToken));
      localStorage.setItem("token", data.token);

      // Updating auth context
      dispatch({ type: "LOGIN", payload: userWithToken });

      return userWithToken;
    }
  } catch (err) {
    console.log(err);
    setError(err.message || "Login failed");
    return null;
  }
};


  return { login, error };
};

export default useLogin;