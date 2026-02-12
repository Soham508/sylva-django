import logo from "/sylva_logo_black.png";
import { useAuth } from '../../context/AuthContext';
import { Navigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import GoogleButton from 'react-google-button';

const Login = () => {
    const { currentUser, login } = useAuth();

    const handleLogin = async () => {
        try {
            await login();
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    if (currentUser) {
        return <Navigate to="/dashboard" />;
    }


    return (
        <div className="relative h-screen w-full bg-black flex items-center ">
            <div className="h-full w-1/2 border-r-2 flex items-center justify-center">
                <img
                    className="h-1/2 w-1/2 object-cover"
                    src={logo}
                    alt="Logo"
                />
            </div>
            <div className="h-full w-1/2 flex flex-col items-center bg-slate-100">

                <div className="w-1/2 mt-28 flex flex-col items-center rounded-md gap-y-20 p-8">
                    <h1 className="text-[40px] text-black font-serif cursor-text">Login page</h1>
                    <div className="flex flex-col gap-y-8 w-full items-center border-b-[1px] border-black pb-10">
                        <div className="flex w-full items-center flex-row gap-x-2 p-1 border-black border-b-2">
                            <MdEmail size={28} />
                            <input type="email" placeholder="Enter your email" className="w-full p-4  text-xl hover:bg-slate-200/90 border-0 font-serif bg-slate-100 text-black  border-black  focus:border-0  placeholder:text-black focus:outline-none focus:ring-0 placeholder-black " />
                        </div>
                        <div className="flex w-full items-center flex-row gap-x-2 p-1 border-b-2 border-black ">
                            <RiLockPasswordFill size={28} />
                            <input type="password" placeholder="Enter your password" className="w-full p-4  text-xl hover:bg-slate-200/90 font-serif bg-slate-100 text-black border-0 focus:border-0 placeholder:text-black focus:outline-none focus:ring-0 placeholder-black" />
                        </div>
                        <span className="self-start cursor-pointer border-b-[1px] border-slate-100 hover:border-black -mt-4">Forgot passwrod?</span>
                        <button className="relative mt-10 h-12 w-32 active:bg-black/80  hover:bg-black/80 flex cursor-pointer items-center justify-center  text-white bg-black  font-semibold overflow-hidden">
                            Submit
                        </button>
                    </div>

                </div>

                <GoogleButton
                    onClick={handleLogin}
                    type="dark"
                />
            </div>

        </div>
    )
}

export default Login