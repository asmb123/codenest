import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { authClient } from "./utils/auth-client";

type FormData = {
  username: string;
  email?: string;
}

export default function App() {

  const [login, setLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
  })

  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      navigate("/home");
    }
  }, [navigate, session?.user])

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

    if (login === true) {
      if (formData.email === "") {
        alert("Please enter your email");
      }
      const res = await authClient.signIn.magicLink({
        email: formData.email!,
        callbackURL: `${FRONTEND_URL}/home`,
        newUserCallbackURL: `${FRONTEND_URL}/home`,
        errorCallbackURL: `${FRONTEND_URL}/error`,
      })
      if (res.data?.status) {
        alert("Check you mailbox");
      } else {
        console.log(res.error);
      }
    } else {
      if (formData.email === "") {
        alert("Please enter your email");
      }
      if (formData.username === "") {
        alert("Please enter your username");
      }
      const res = await authClient.signIn.magicLink({
        email: formData.email!,
        name: formData.username,
        callbackURL: `${FRONTEND_URL}/home`,
        newUserCallbackURL: `${FRONTEND_URL}/home`,
        errorCallbackURL: `${FRONTEND_URL}/error`,
      })

      if (res.data?.status) {
        alert("Check you mailbox");
      }
    }
  }
  return (
    <div className="bg-black text-white w-screen h-screen flex flex-col justify-center items-center">
      <p className="text-2xl">SIGNUP/LOGIN</p>
      <form onSubmit={handleSubmit} className="w-[60vw] md:w-[30vw] h-[60vh] border border-white flex flex-col justify-center items-center gap-3">
        Enter details to get Magic Link
        {!login && <input type="text" placeholder="Enter username" value={formData.username} onChange={(e) => { setFormData({ ...formData, username: e.target.value }) }} name="username" id="username" className="border border-white p-1" />}
        <input type="text" placeholder="Enter email" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }} name="username" id="username" className="border border-white p-1" />
        <button
          className="p-2 border border-white"
          type="submit"
        >
          {login ? "Login" : "Signup"}
        </button>
        <button
          className="underline hover:cursor-pointer"
          type="button"
          onClick={() => setLogin(e => !e)}>
          {login ? "Don't have an account?" : "Already have an accouont?"}
        </button>
      </form>
    </div >
  )
}