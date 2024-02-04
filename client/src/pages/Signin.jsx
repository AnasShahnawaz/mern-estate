import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

function Signin() {
  const [formData, setFormData] = useState({});
  const { error, message } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const { data } = await axios.post("https://mern-estate-server-phi.vercel.app/api/auth/signin", formData, {
        withCredentials: true,
      });
      if (data.error) {
        dispatch(signInFailure(data.error));
      } else if (data.message) {
        dispatch(signInMessage(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate("/");
        console.log(data);
      }
    } catch (err) {
      signInFailure();
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto p-5">
      <h1 className="my-7 font-semibold text-3xl text-center">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          className="p-3 rounded-lg border"
          placeholder="Email"
          required
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          className="p-3 rounded-lg border"
          placeholder="Password"
          required
          name="password"
          onChange={handleChange}
        />
        <button
          className="uppercase p-3 text-white bg-slate-700 rounded-lg disabled:opacity-80"
        >
          
          Sign in
        </button>
        <OAuth />
      </form>
      <div className="flex mt-5 gap-2">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 hover:underline">Sign up</span>
        </Link>
      </div>
      <div className="flex gap-2">
        <p>Forgot password?</p>
        <Link to={"/forgot-password"}>
          <span className="text-blue-700 hover:underline">Click here</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
      {message && <p className="text-green-500 mt-5 text-center">{message}</p>}
    </div>
  );
}

export default Signin;
