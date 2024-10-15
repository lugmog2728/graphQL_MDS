import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

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

    input CreateUserInput {
        username: String!
        email: String!
    }

    input CreateArtistInput {
        name: String!
    }

    input CreateMusiqueInput {
        title: String!
        duree: Int!
        albumId: Int!
        artistId: Int!
    }

    input CreateAlbumInput {
        title: String!
        artistId: Int!
    }

    input CreatePlaylistInput {
        name: String!
        description: String
        createdById: Int!
    }

    input AddMusicToPlaylistInput {
        playlistId: Int!
        musiqueId: Int!
    }

    input AddMusicToAlbumInput {
        albumId: Int!
        musiqueId: Int!
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        createArtist(input: CreateArtistInput!): Artist!
        createMusique(input: CreateMusiqueInput!): Musique!
        createAlbum(input: CreateAlbumInput!): Album!
        createPlaylist(input: CreatePlaylistInput!): Playlist!
        addMusicToPlaylist(input: AddMusicToPlaylistInput!): Playlist!
        addMusicToAlbum(input: AddMusicToAlbumInput!): Album!
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

const artistLoader = new DataLoader(async (ids) => {
    const artists = await prisma.artist.findMany({
        where: {
            id: { in: ids }
        }
    });
    return ids.map(id => artists.find(artist => artist.id === id));
});

const albumLoader = new DataLoader(async (ids) => {
    const albums = await prisma.album.findMany({
        where: {
            id: { in: ids }
        }
    });
    return ids.map(id => albums.find(album => album.id === id));
});

const musiqueLoader = new DataLoader(async (ids) => {
    const musiques = await prisma.musique.findMany({
        where: {
            id: { in: ids }
        }
    });
    return ids.map(id => musiques.find(musique => musique.id === id));
});

const playlistLoader = new DataLoader(async (ids) => {
    const playlists = await prisma.playlist.findMany({
        where: {
            id: { in: ids }
        }
    });
    return ids.map(id => playlists.find(playlist => playlist.id === id));
});

const userLoader = new DataLoader(async (ids) => {
    const users = await prisma.user.findMany({
        where: {
            id: { in: ids }
        }
    });
    return ids.map(id => users.find(user => user.id === id));
});

const resolvers = {
    Query: {
        artists: () => prisma.artist.findMany(),
        albums: () => prisma.album.findMany(),
        musiques: () => prisma.musique.findMany(),
        playlists: () => prisma.playlist.findMany(),
        users: () => prisma.user.findMany(),
        artistById: (_, { id }) => artistLoader.load(id),
        albumById: (_, { id }) => albumLoader.load(id),
        musiqueById: (_, { id }) => musiqueLoader.load(id),
        playlistById: (_, { id }) => playlistLoader.load(id),
        userById: (_, { id }) => userLoader.load(id),
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
       // musiques: async ({ id }) => (await prisma.playlist.findUnique({ where: { id: id }, include:{musiques: true}})).musiques,
        musiques: ({ id }) => prisma.musique.findMany({ where: { playlists: { some: { id } }}}),
        createdBy: ({ createdById }) => prisma.user.findUnique({ where: { id: createdById }}), // Correction ici
    },
    User: {
        playlists: ({ id }) => prisma.playlist.findMany({ where: { createdById: id } }),
    },

    Mutation: {
        createArtist: async (_, { input }) => {
            return prisma.artist.create({
                data: {
                    name: input.name,
                },
            });
        },
        createMusique: async (_, { input }) => {
            return prisma.musique.create({
                data: {
                    title: input.title,
                    duree: input.duree,
                    albumId: input.albumId,
                    artistId: input.artistId,
                },
            });
        },
        createAlbum: async (_, { input }) => {
            return prisma.album.create({
                data: {
                    title: input.title,
                    artistId: input.artistId,
                },
            });
        },
        createPlaylist: async (_, { input }) => {
            return prisma.playlist.create({
                data: {
                    name: input.name,
                    description: input.description,
                    createdById: input.createdById,
                    createdAt: new Date(),
                },
            });
        },
        addMusicToPlaylist: async (_, { input }) => {
            const { playlistId, musiqueId } = input;
            return await prisma.playlist.update({
                where: { id: playlistId },
                data: {
                    musiques: {
                        connect: { id: musiqueId },
                    },
                },
            });
        },
        addMusicToAlbum: async (_, { input }) => {
            const { albumId, musiqueId } = input;
            return await prisma.album.update({
                where: { id: albumId },
                data: {
                    musiques: {
                        connect: { id: musiqueId },
                    },
                },
            });
        },

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
