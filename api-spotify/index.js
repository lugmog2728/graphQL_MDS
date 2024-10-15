import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
    type Artist {
        id: Int!
        name: String!
        genres: [String!]!
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
    }
`;

const artists = [
    {
        id: 1,
        name: "Arctic Monkeys",
        genres: ["Indie Rock", "Alternative"],
    },
    {
        id: 2,
        name: "Adele",
        genres: ["Pop", "Soul"],
    },
    {
        id: 3,
        name: "Rick Astley",
        genres: ["Pop", "Dance"],
    }
];

const albums = [
    {
        id: 1,
        title: "AM",
        artistId: 1,
    },
    {
        id: 2,
        title: "25",
        artistId: 2,
    },
    {
        id: 3,
        title: "Whenever You Need Somebody",
        artistId: 3,
    }
];

const musiques = [
    {
        id: 1,
        title: "Do I Wanna Know?",
        duree: 272,
        albumId: 1,
        artistId: 1,
    },
    {
        id: 2,
        title: "R U Mine?",
        duree: 202,
        albumId: 1,
        artistId: 1,
    },
    {
        id: 3,
        title: "Hello",
        duree: 295,
        albumId: 2,
        artistId: 2,
    },
    {
        id: 4,
        title: "Never Gonna Give You Up",
        duree: 213,
        albumId: 3,
        artistId: 3,
    }
];

const playlists = [
    {
        id: 1,
        name: "Rock Vibes",
        description: "A collection of the best rock songs.",
        createdById: 1,
        createdAt: "2024-10-01",
    },
    {
        id: 2,
        name: "Chill Pop",
        description: "Relaxing pop songs to wind down.",
        createdById: 2,
        createdAt: "2024-10-02",
    },
    {
        id: 3,
        name: "80s Classics",
        description: "All-time favorite hits from the 80s.",
        createdById: 2,
        createdAt: "2024-10-03",
    }
];

const users = [
    {
        id: 1,
        username: "rocklover",
        email: "rocklover@example.com",
    },
    {
        id: 2,
        username: "popfan",
        email: "popfan@example.com",
    }
];



const resolvers = {
    Query: {
        artists: () => artists,
        albums: () =>  albums,
        musiques: () => musiques,
        playlists: () => playlists,
        users: () => users, 
    },

    Artist: {
        albums: ({ id }) => albums.filter((album) => album.artistId === id),
        musiques: ({ id }) => musiques.filter((musique) => musique.artistId === id),
    },

    Album: {
        artist: ({ artistId }) => artists.find((artist) => artist.id === artistId),
        musiques: ({ id }) => musiques.filter((musique) => musique.albumId === id),
    },

    Musique: {
        album: ({ albumId }) => albums.find((album) => album.id === albumId),
        artist: ({ artistId }) => artists.find((artist) => artist.id === artistId),
    },

    Playlist: {
        musiques: ({ id }) => musiques.filter((musique) => musique.playlistId === id),
        createdBy: ({ createdById }) => users.find((user) => user.id === createdById),
    },

    User: {
        playlists: ({ id }) => playlists.filter((playlist) => playlist.createdById === id),
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