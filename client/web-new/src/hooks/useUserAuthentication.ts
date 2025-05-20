import { useEffect } from "react";
import { useUsers } from "../store/users";
import { API_USER, cookies } from "../utils/api/apiUser";

export const useUsersAuthentication = () => {
  const { setUser } = useUsers.getState();

  useEffect(() => {
    const fetchUser = async () => {
       const token = cookies.get("access_token");
       if (!token) return;

       try {
           const user = await API_USER.me();
           setUser(user); 
       } catch (error) {
           console.error("Ошибка при получении данных пользователя:", error);
       }
    };

    fetchUser();
  }, [setUser]);

  return null;
};