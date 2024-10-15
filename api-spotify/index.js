import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Initialize Prisma Client

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
    type Artist {
        id: Int!
        name: String!
        albums: [Album!]!
        musiques: [Musique!]!
    }

    type Album {
        id: Int!
        title: String!
        artist: Artist!
        musiques: [Musique!]!
    }

    type Musique {
        id: Int!
        title: String!
        duree: Int!
        album: Album!
        artist: Artist!
    }

    type Playlist {
        id: Int!
        name: String!
        description: String
        musiques: [Musique!]!
        createdBy: User!
        createdAt: String!
    }

    type User {
        id: Int!
        username: String!
        email: String!
        playlists: [Playlist!]!
    }

    type Query {
        artists: [Artist!]!
        albums: [Album!]!
        musiques: [Musique!]!
        playlists: [Playlist!]!
        users: [User!]!
        artistById(id: Int!): Artist 
        albumById(id: Int!): Album 
        musiqueById(id: Int!): Musique
        playlistById(id: Int!): Playlist 
        userById(id: Int!): User
    }
`;

const resolvers = {
    Query: {
        artists: () => prisma.artist.findMany(),
        albums: () => prisma.album.findMany(),
        musiques: () => prisma.musique.findMany(),
        playlists: () => prisma.playlist.findMany(),
        users: () => prisma.user.findMany(),
        artistById: (_, { id }) => prisma.artist.findUnique({ where: { id } }),
        albumById: (_, { id }) => prisma.album.findUnique({ where: { id } }),
        musiqueById: (_, { id }) => prisma.musique.findUnique({ where: { id } }),
        playlistById: (_, { id }) => prisma.playlist.findUnique({ where: { id } }),
        userById: (_, { id }) => prisma.user.findUnique({ where: { id } }),
    },
    Artist: {
        albums: ({ id }) => prisma.album.findMany({ where: { artistId: id } }),
        musiques: ({ id }) => prisma.musique.findMany({ where: { artistId: id } }),
    },
    Album: {
        artist: ({ artistId }) => prisma.artist.findUnique({ where: { id: artistId } }), // Correction ici
        musiques: ({ id }) => prisma.musique.findMany({ where: { albumId: id } }),
    },
    Musique: {
        album: ({ albumId }) => prisma.album.findUnique({ where: { id: albumId } }), // Correction ici
        artist: ({ artistId }) => prisma.artist.findUnique({ where: { id: artistId } }), // Correction ici
    },
    Playlist: {
        musiques: ({ id }) => prisma.musique.findMany({ where: { id: id } }),
        createdBy: ({ createdById }) => prisma.user.findUnique({ where: { id: createdById }}), // Correction ici
    },
    User: {
        playlists: ({ id }) => prisma.playlist.findMany({ where: { createdById: id } }),
    },
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
