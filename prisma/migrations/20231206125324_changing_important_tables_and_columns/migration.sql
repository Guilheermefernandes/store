/*
  Warnings:

  - You are about to drop the `tshirt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tshirt_color` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tshirt_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tshirt_size` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tshirt_data` DROP FOREIGN KEY `tshirt_data_color_id_fkey`;

-- DropForeignKey
ALTER TABLE `tshirt_data` DROP FOREIGN KEY `tshirt_data_size_id_fkey`;

-- DropForeignKey
ALTER TABLE `tshirt_data` DROP FOREIGN KEY `tshirt_data_tshirt_id_fkey`;

-- DropTable
DROP TABLE `tshirt`;

-- DropTable
DROP TABLE `tshirt_color`;

-- DropTable
DROP TABLE `tshirt_data`;

-- DropTable
DROP TABLE `tshirt_size`;

-- CreateTable
CREATE TABLE `parts_size` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `size` VARCHAR(2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clothing_parts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `price` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `collection` INTEGER NULL,
    `describe_part` VARCHAR(191) NOT NULL,
    `type_id` INTEGER NOT NULL,
    `product_line_id` INTEGER NOT NULL,
    `date_created` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_line` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parts_color` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hexa_decimal` VARCHAR(16) NOT NULL,
    `name_color` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parts_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qtd_parts` INTEGER NOT NULL,
    `color_id` INTEGER NOT NULL,
    `size_id` INTEGER NOT NULL,
    `part_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clothing_parts` ADD CONSTRAINT `clothing_parts_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clothing_parts` ADD CONSTRAINT `clothing_parts_product_line_id_fkey` FOREIGN KEY (`product_line_id`) REFERENCES `product_line`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parts_data` ADD CONSTRAINT `parts_data_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `parts_color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parts_data` ADD CONSTRAINT `parts_data_size_id_fkey` FOREIGN KEY (`size_id`) REFERENCES `parts_size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parts_data` ADD CONSTRAINT `parts_data_part_id_fkey` FOREIGN KEY (`part_id`) REFERENCES `clothing_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
