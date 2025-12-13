
import mongoose, { ConnectOptions } from "mongoose";
const { MONGODB_URI, MONGODB_DB } = process.env;

declare global {
    var mongoose: {
        conn: mongoose.Mongoose | null
        promise: Promise<mongoose.Mongoose> | null
    }; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {

    if (!MONGODB_URI) {
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env.local",
        );
    }

    if (!MONGODB_DB) {
        throw new Error(
            'Please define the MONGODB_DB environment variable inside .env.local'
        )
    }

    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: MONGODB_DB
        } as ConnectOptions;
        cached.promise = mongoose.connect(MONGODB_URI, opts)
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export async function getMongoDbClient() {
    const { connection } = await dbConnect();
    
    if (!connection.db) throw new Error("Failed to get MongoDB client.");

    const client = connection.getClient()

    return { client, db: client.db(MONGODB_DB) };
}

// import mongoose, { ConnectOptions, MongooseOptions } from "mongoose";

// const { MONGODB_URI, MONGODB_DB } = process.env


// declare global {
//     namespace globalThis {
//         var mongooseCache: {
//             conn: typeof mongoose | null
//             promise: Promise<typeof mongoose> | null
//         }
//     }
// }

// let cached = global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

// export async function connectToDatabase() {
//     if (cached.conn) {
//         console.log('mongodb connection cached')
//         return cached.conn
//     }

//     if (!cached.promise) {
//         const opts = {
//             dbName: MONGODB_DB
//         } as ConnectOptions



//         cached.promise = mongoose.connect(MONGODB_URI, opts).then(client => {
//             console.log('mongodb connection created')
//             return client
//         })
//     }
//     cached.conn = await cached.promise
//     return cached.conn
// }

// export async function getMongoDbClient() {
//     await connectToDatabase()
//     return mongoose.connection.getClient().db(MONGODB_DB)
// }