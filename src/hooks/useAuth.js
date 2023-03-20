import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useLocalStorage("token", null);
  const navigate = useNavigate();

  const login = async (data: any) => {
    axios.post('https://68i17san2e.execute-api.us-east-1.amazonaws.com/dev/api/v1/auth',{
      "username": data.username,
      "password": data.password
  })
    .then(function (response) {
      setToken(response.data.token);
    })
    .catch(function (error) {
      console.log(error);
    });

  };

  const logout = () => {
    setToken(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      login,
      logout
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
