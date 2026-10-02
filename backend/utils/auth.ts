import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { Pool } from "pg";
import { Resend } from "resend";
import { configDotenv } from "dotenv";

configDotenv();

if (!process.env.FRONTEND_URL) {
    throw Error("Set FRONTEND_URL in .env");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.FRONTEND_URL],
    database: new Pool({
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DATABASE,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        maxLifetimeSeconds: 60,
    }),
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, token, url, metadata }, ctx) => {
                const { data, error } = await resend.emails.send({
                    from: process.env.EMAIL_FROM!,
                    to: [email],
                    subject: "Please verify your mail",
                    html: `<strong>Click on the mail to verify!</strong> <br/> <p>${url}</p>`,
                })

                if (error) {
                    throw Error(error.message);
                }
                console.log("Succesfully sent: ", data);
            }
        }
        )
    ]
})