-- CreateTable
CREATE TABLE "Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "artistId" INTEGER NOT NULL,
    CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Musique" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "duree" INTEGER NOT NULL,
    "albumId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    CONSTRAINT "Musique_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Musique_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Playlist_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PlaylistMusiques" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PlaylistMusiques_A_fkey" FOREIGN KEY ("A") REFERENCES "Musique" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PlaylistMusiques_B_fkey" FOREIGN KEY ("B") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UserPlaylists" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserPlaylists_A_fkey" FOREIGN KEY ("A") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserPlaylists_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PlaylistMusiques_AB_unique" ON "_PlaylistMusiques"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaylistMusiques_B_index" ON "_PlaylistMusiques"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPlaylists_AB_unique" ON "_UserPlaylists"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPlaylists_B_index" ON "_UserPlaylists"("B");
