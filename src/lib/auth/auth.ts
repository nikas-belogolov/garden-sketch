import { betterAuth, BetterAuthPlugin } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoDbClient } from "../db";
import { emailHarmony } from 'better-auth-harmony';

const { client, db } = await getMongoDbClient()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        usePlural: true,
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            treys: {
                type: "json",
                defaultValue: "[]"
            }
        }
    },
    plugins: [emailHarmony() as BetterAuthPlugin]
});
