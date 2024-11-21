import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../constant";
import { toast } from "react-toastify";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Login", { email, password });
      const { data } = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password
      });

      console.log("response : ", data);
      if (data?.success) {
        console.log("Admin logged in");
        setToken(data?.token);
      } else {
        console.log("Admin could not login");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error in onSubmitHandler in Login.jsx. err is : ", err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              type="email"
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              type="password"
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
