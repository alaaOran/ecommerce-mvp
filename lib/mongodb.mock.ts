// Mock MongoDB implementation for development
const mockDB = {
  collection: (name: string) => ({
    findOne: async (query: any) => {
      console.log('Mock findOne:', { collection: name, query })
      if (name === 'users' && query.email) {
        return null // User not found in mock
      }
      return null
    },
    insertOne: async (data: any) => {
      console.log('Mock insertOne:', { collection: name, data })
      return { insertedId: 'mock-id' }
    },
    updateOne: async (filter: any, update: any) => {
      console.log('Mock updateOne:', { collection: name, filter, update })
      return { modifiedCount: 1 }
    },
    deleteOne: async (filter: any) => {
      console.log('Mock deleteOne:', { collection: name, filter })
      return { deletedCount: 1 }
    },
    find: () => ({
      toArray: async () => {
        console.log('Mock find:', { collection: name })
        return []
      },
      sort: () => ({
        limit: () => ({
          toArray: async () => {
            console.log('Mock find with sort and limit:', { collection: name })
            return []
          }
        })
      })
    })
  })
}

export const clientPromise = {
  db: () => mockDB,
  close: () => Promise.resolve()
}
