import { MongoClient, ServerApiVersion, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null
let clientPromise: Promise<MongoClient> | null = null

if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI
  
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the connection across module reloads
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      })
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, avoid using a global variable
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
    clientPromise = client.connect()
  }

  if (client) {
    db = client.db()
  }
} else if (process.env.NODE_ENV !== 'test') {
  console.warn('MONGODB_URI not found in environment variables. Some features may not work.')
}

export { client, db, clientPromise }