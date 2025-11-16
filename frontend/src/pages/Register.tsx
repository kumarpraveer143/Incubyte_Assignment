import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import type { ReduxDispatchType, ReduxStoreType } from "../redux/store";
import { registerUser } from "../redux/slice/userDataSlice";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const error = useSelector((state: ReduxStoreType) => state.userData.error);
    const dispatch = useDispatch<ReduxDispatchType>();
    const token = useSelector((state: ReduxStoreType) => state.userData.userInfo.token);

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("password not match...");
            return;
        }
        const { name, email, password } = formData;
        dispatch(registerUser({ name, email, password }));
    }, [formData, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#27374D] via-[#526D82] to-[#9DB2BF] px-4">
            <div className="w-full max-w-md bg-[#0f1724]/90 backdrop-blur-sm border border-[#27374D] rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-extrabold text-center text-[#DDE6ED]">Create Account</h2>
                <p className="text-center text-sm text-[#9DB2BF] mt-1">Join us and explore the sweet world</p>

                {error && (<p className="text-red-400 text-center mt-4">{error}</p>)}

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#DDE6ED]">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full name"
                            required
                            className="mt-2 w-full px-4 py-2 border border-[#526D82] bg-[#0b1220] text-[#DDE6ED] rounded-lg shadow-sm focus:ring-2 focus:ring-[#9DB2BF] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#DDE6ED]">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="mt-2 w-full px-4 py-2 border border-[#526D82] bg-[#0b1220] text-[#DDE6ED] rounded-lg shadow-sm focus:ring-2 focus:ring-[#9DB2BF] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#DDE6ED]">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="********"
                            required
                            className="mt-2 w-full px-4 py-2 border border-[#526D82] bg-[#0b1220] text-[#DDE6ED] rounded-lg shadow-sm focus:ring-2 focus:ring-[#9DB2BF] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPass" className="block text-sm font-medium text-[#DDE6ED]">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPass"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="********"
                            required
                            className="mt-2 w-full px-4 py-2 border border-[#526D82] bg-[#0b1220] text-[#DDE6ED] rounded-lg shadow-sm focus:ring-2 focus:ring-[#9DB2BF] focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gradient-to-r from-[#526D82] to-[#9DB2BF] text-[#0f1724] font-semibold rounded-lg shadow-lg hover:brightness-105 transition focus:ring-4 focus:ring-[#27374D]/40"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#9DB2BF]">Already have an account? <Link to="/login" className="font-medium underline decoration-dotted">Login</Link></p>

            </div>
        </div>
    )
}
