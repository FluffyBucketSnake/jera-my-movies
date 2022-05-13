/*
  Warnings:

  - A unique constraint covering the columns `[userDataId,name]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_userDataId_name_key" ON "Profile"("userDataId", "name");
