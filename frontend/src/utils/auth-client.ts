import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
const BETTER_AUTH_URL = import.meta.env.VITE_BACKEND_URL;

export const authClient = createAuthClient({
    baseURL: BETTER_AUTH_URL,
    plugins: [magicLinkClient()]
})
export const { signIn, signUp, useSession } = authClient;