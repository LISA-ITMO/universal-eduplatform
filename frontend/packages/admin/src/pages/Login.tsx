import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { LOGIN_MUTATION } from "@quiz-platform/ui";
import { useAuth, LoginForm } from "@quiz-platform/ui";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  const onSubmit = async (data: { identifier: string; password: string }) => {
    try {
      const response = await loginMutation({
        variables: {
          input: { identifier: data.identifier, password: data.password },
        },
      });
      const payload = response.data?.login;
      if (payload) {
        const role = payload.user?.role;
        if (role !== "admin" && role !== "teacher") {
          toast.error("Этот аккаунт не имеет доступа в админ-панель");
          return;
        }
        login(payload.accessToken, payload.user);
        toast.success("Вход в админ-панель выполнен");
        navigate("/");
      }
    } catch (e: any) {
      toast.error(e.message || "Ошибка входа");
    }
  };

  return (
    <LoginForm onSubmit={onSubmit} loading={loading} title="Админ: вход" />
  );
};

export default AdminLogin;
