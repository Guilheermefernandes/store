/*
  Warnings:

  - Made the column `unique_indentifier` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `unique_indentifier` VARCHAR(191) NOT NULL;
