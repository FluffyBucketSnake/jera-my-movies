-- CreateTable
CREATE TABLE "UserData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userDataId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieWatchlistEntry" (
    "movieId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "watched" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserData_userId_key" ON "UserData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieWatchlistEntry_movieId_profileId_key" ON "MovieWatchlistEntry"("movieId", "profileId");

-- AddForeignKey
ALTER TABLE "UserData" ADD CONSTRAINT "UserData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userDataId_fkey" FOREIGN KEY ("userDataId") REFERENCES "UserData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieWatchlistEntry" ADD CONSTRAINT "MovieWatchlistEntry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
