import {Dumbbell, EggFried, LayoutDashboard, LogOut} from "lucide-react";
import {Link, useLocation} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "@/providers/AuthProvider.tsx";

const Sidebar = () => {
    const location = useLocation();
    const {setAuth} = useContext(AuthContext);

    const isActiveTab = (path: string) => {
        return location.pathname === path;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");

        if (setAuth) {
            setAuth({
                isAuthenticated: false,
                user: 'Anonymous'
            });
        }

        window.location.href = "/login";
    }

    return (
        <>
            <div className="hidden lg:flex flex-col h-screen w-[250px] justify-between border-e bg-slate-50">
                <div className="px-4 py-6 text-center">
                    <span className="text-xl text-gray-600 font-medium"> FitnessApp </span>
                    <ul className="mt-6 block items-center justify-center">
                        <Link to="/">
                            <li className="flex justify-center items-center w-full hover:bg-blue-50">
                                <div
                                    className="flex items-center justify-center text-center rounded-lg px-4 py-6 text-sm">
                                    <div>
                                        <LayoutDashboard
                                            className={isActiveTab('/') ? "text-blue-600" : "text-gray-400"}/>
                                    </div>
                                    <span
                                        className={isActiveTab('/') ? "text-black font-bold w-full flex ml-7" : "text-gray-400 w-full flex ml-7"}>
                                    Dashboard
                                </span>
                                </div>
                            </li>
                        </Link>
                        <Link to="/exercise">
                            <li className="flex justify-center items-center w-full hover:bg-blue-50">
                                <div
                                    className="flex items-center justify-center text-center rounded-lg px-4 py-6 text-sm">
                                    <div>
                                        <Dumbbell
                                            className={isActiveTab('/exercise') ? "text-blue-600" : "text-gray-400"}/>
                                    </div>
                                    <span
                                        className={isActiveTab('/exercise') ? "text-black font-bold w-full flex ml-7" : "text-gray-400 w-full flex ml-7"}>Exercise</span>
                                </div>
                            </li>
                        </Link>
                        <Link to="/food">
                            <li className="flex justify-center items-center w-full hover:bg-blue-50">
                                <div
                                    className="flex items-center justify-center text-center rounded-lg px-4 py-6 text-sm">
                                    <div>
                                        <EggFried className={isActiveTab('/food') ? "text-blue-600" : "text-gray-400"}/>
                                    </div>
                                    <span
                                        className={isActiveTab('/food') ? "text-black font-bold w-full flex ml-7" : "text-gray-400 w-full flex ml-7"}>Food</span>
                                </div>
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="sticky inset-x-0 bottom-0 border-t border-gray-200 cursor-pointer hover:bg-blue-50">
                    <div
                        className="flex justify-center items-center text-center rounded-lg px-4 py-7 text-sm font-medium text-gray-700 gap-6"
                        onClick={handleLogout}>
                        <LogOut/>
                        <span>Logout</span>
                    </div>
                </div>
            </div>
            <div className="lg:hidden">
                <div className="flex h-screen w-16 flex-col justify-between border-e bg-white">
                    <div>
                        <div className="inline-flex h-16 w-16 items-center justify-center">
                            <span
                                className="grid h-10 w-10 place-content-center rounded-lg bg-blue-50 text-xs text-gray-600">
                                FA
                            </span>
                        </div>
                        <div className="border-t border-gray-100">
                            <div className="px-2">
                                <ul className="space-y-1 border-t border-gray-100 pt-4">
                                    <li className="py-4">
                                        <Link to="/"
                                              className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-500">
                                            <LayoutDashboard/>
                                            <span
                                                className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                                                Dashboard
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="py-4">
                                        <Link
                                            to="/exercise"
                                            className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-500">
                                            <Dumbbell/>
                                            <span
                                                className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                                                Exercises
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="py-4">
                                        <Link
                                            to="/food"
                                            className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-500">
                                            <EggFried/>
                                            <span
                                                className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                                                Food
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
                        <button
                            onClick={handleLogout}
                            className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-blue-500">
                            <LogOut/>
                            <span
                                className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                                    Logout
                                </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;