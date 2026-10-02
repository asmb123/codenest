import { Navigate, Outlet } from "react-router";
import { authClient } from "../utils/auth-client";

export const ProtectedRoute = () => {

    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <div className="bg-black text-white text-2xl w-screen h-screen flex justify-center items-center">Fetching user details...</div>;
    }
    if (!session) {
        return <div><Navigate to="/" replace /></div>;
    }

    return <Outlet />;
}