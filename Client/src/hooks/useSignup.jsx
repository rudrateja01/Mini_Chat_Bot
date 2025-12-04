import { useState } from "react";
import axios from "axios";

const useSignup = () => {
  const [error, setError] = useState(null);

  const signup = async (firstname, lastname, email, password, confirmpassword, role = "user") => {
    setError(null);

    try {
      const res = await axios.post("https://mini-chat-bot-sv7z.onrender.com/api/auth/signup", {
        firstname,
        lastname,
        email,
        password,
        confirmpassword,
        role, // default "user"
      });

      if (res.status === 201) {
        return res.data.user;
      }
    } catch (err) {
      console.log("SIGNUP ERROR =>", err.response?.data);
      setError(err.response?.data?.message || "Signup failed");
      return null;
    }
  };

  return { signup, error };
};

export default useSignup;
