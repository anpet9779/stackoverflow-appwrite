"use client";

import { useAuthStore } from "@/Store/Auth";
import React from "react";

const RegisterPage = () => {
  const { createAccount, login } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Collect form data using FormData API
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const name = formData.get("name") as string;

      //   Validate form data
      if (!email || !password || !name) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      //   Call createAccount and handle response
      const response = await createAccount(email, password, name);

      if (response.error) {
        setError(response.error!.message);
      } else {
        // Automatically log in the user after successful registration
        const loggedIn = await login(email.toString(), password.toString());
        if (!loggedIn.success) {
          setError(loggedIn.error!.message);
        }
      }
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
