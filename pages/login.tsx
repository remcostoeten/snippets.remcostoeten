import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { auth, googleAuthProvider } from '../lib/firebase';
import Image from 'next/image';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to login with Google.');
    }
  };

  return (
    <div className="border-red-500 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 p-5 flex rounded-2xl shadow-lg max-w-3xl">
        <div className="md:w-1/2 px-5">
          <h2 className="text-2xl font-bold text-[#002D74]">Login</h2>
          <p className="text-sm mt-4 text-[#002D74]">If you have an account, please login</p>
          <form className="flex flex-col gap-4 items-center">
            <input
              type="email"
              className="p-2 m-5 mb-1 rounded-xl border"
              name="email"
              placeholder="Enter Username/email"
              value={email}
              onChange={handleEmailChange}
            />
            <div className="relative">
              <input
                type="password"
                className="w-full p-2 rounded-xl border"
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button
              className="bg-[#002074] rounded-xl py-2 text-white max-w-full px-10 hover:scale-105 duration-300"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>

          <div className="mt-7 grid grid-cols-3 items-center text-gray-500">
            <hr className="border-gray-500" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-500" />
          </div>

          <button
            className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300"
            onClick={handleGoogleLogin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25px"
              height="25px"
              fill="currentColor"
              className="bi bi-google mr-3"
              viewBox="0 0 16 16"
            >
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
            Login with Google
          </button>

          <div className=" mt-1 text-xs border-b py-6 border-gray-400">
            <a href="">Forgot your password..</a>
          </div>

          <div className="text-sm flex justify-between items-center mt-3">
            <p>If you do not have an account...</p>
            <button className="py-2 px-5 ml-3 bg-white border rounded-xl hover:scale-110 duration-300 border-blue-400  ">
              Register
            </button>
          </div>
        </div>

        <div className="w-1/2 md:block hidden">
          <Image
            width={364}
            height={546}
            src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
            className="rounded-2xl"
            alt="page img"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
