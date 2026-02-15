import { useState } from "react";
import { registerApi } from "../../services/authService";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      const res = await registerApi(form);

      setSuccess(res.message);
      setError("");

      console.log(res);
    } catch (err: any) {
      console.log(err.response.data);

      if (err.response.data.messages) {
        setError(err.response.data.messages.join(", "));
      } else {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleRegister}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />

        <input
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
