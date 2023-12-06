/*
  Warnings:

  - You are about to drop the column `collection` on the `clothing_parts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clothing_parts` DROP COLUMN `collection`,
    ADD COLUMN `collection_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `collection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `describe` VARCHAR(2000) NOT NULL,
    `date_created` DATETIME(3) NOT NULL,
    `background` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clothing_parts` ADD CONSTRAINT `clothing_parts_collection_id_fkey` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
