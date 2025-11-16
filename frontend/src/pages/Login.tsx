import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slice/userDataSlice";
import type { ReduxDispatchType, ReduxStoreType } from "../redux/store";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const error = useSelector((state: ReduxStoreType) => state.userData.error)
    const dispatch = useDispatch<ReduxDispatchType>();
    const token = useSelector((state: ReduxStoreType) => state.userData.userInfo.token);

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate])

    // use functional update to avoid stale deps
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const { email, password } = formData;
        dispatch(loginUser({ email, password }));
    }, [formData, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#27374D] via-[#526D82] to-[#9DB2BF] px-4">
            <div className="w-full max-w-md bg-[#0f1724]/90 backdrop-blur-sm border border-[#27374D] rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-extrabold text-center text-[#DDE6ED]">Welcome back</h2>
                <p className="text-center text-sm text-[#9DB2BF] mt-1">Sign in to continue to the Sweets Dashboard</p>

                {error && (<p className="text-red-400 text-center mt-4">{error}</p>)}

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gradient-to-r from-[#526D82] to-[#9DB2BF] text-[#0f1724] font-semibold rounded-lg shadow-lg hover:brightness-105 transition focus:ring-4 focus:ring-[#27374D]/40"
                    >
                        Sign in
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#9DB2BF]">Don't have an account? <Link to="/register" className="font-medium underline decoration-dotted">Create one</Link></p>

                <div className="mt-6 text-center text-xs text-[#9DB2BF] opacity-80">
                    <span>Secure · Fast · Minimal</span>
                </div>
            </div>
        </div>
    )
}
