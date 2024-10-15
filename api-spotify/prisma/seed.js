import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create Artists
    const artist1 = await prisma.artist.create({
        data: {
            name: "Arctic Monkeys",
        },
    });

    const artist2 = await prisma.artist.create({
        data: {
            name: "Adele",
        },
    });

    const artist3 = await prisma.artist.create({
        data: {
            name: "Rick Astley",
        },
    });

    // Create Albums
    const album1 = await prisma.album.create({
        data: {
            title: "AM",
            artistId: artist1.id,
        },
    });

    const album2 = await prisma.album.create({
        data: {
            title: "25",
            artistId: artist2.id,
        },
    });

    const album3 = await prisma.album.create({
        data: {
            title: "Whenever You Need Somebody",
            artistId: artist3.id,
        },
    });

    // Create Musiques
    const musique1 = await prisma.musique.create({
        data: {
            title: "Do I Wanna Know?",
            duree: 272,
            albumId: album1.id,
            artistId: artist1.id,
        },
    });

    const musique2 = await prisma.musique.create({
        data: {
            title: "R U Mine?",
            duree: 202,
            albumId: album1.id,
            artistId: artist1.id,
        },
    });

    const musique3 = await prisma.musique.create({
        data: {
            title: "Hello",
            duree: 295,
            albumId: album2.id,
            artistId: artist2.id,
        },
    });

    const musique4 = await prisma.musique.create({
        data: {
            title: "Never Gonna Give You Up",
            duree: 213,
            albumId: album3.id,
            artistId: artist3.id,
        },
    });

    // Create Users
    const user1 = await prisma.user.create({
        data: {
            username: "rocklover",
            email: "rocklover@example.com",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: "popfan",
            email: "popfan@example.com",
        },
    });

    // Create Playlists
    const playlist1 = await prisma.playlist.create({
        data: {
            name: "Rock Vibes",
            description: "A collection of the best rock songs.",
            createdById: user1.id,
            createdAt: new Date("2024-10-01"),
        },
    });

    const playlist2 = await prisma.playlist.create({
        data: {
            name: "Chill Pop",
            description: "Relaxing pop songs to wind down.",
            createdById: user2.id,
            createdAt: new Date("2024-10-02"),
        },
    });

    const playlist3 = await prisma.playlist.create({
        data: {
            name: "80s Classics",
            description: "All-time favorite hits from the 80s.",
            createdById: user2.id,
            createdAt: new Date("2024-10-03"),
        },
    });

    console.log({ artist1, artist2, artist3, album1, album2, album3, musique1, musique2, musique3, musique4, user1, user2, playlist1, playlist2, playlist3 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
