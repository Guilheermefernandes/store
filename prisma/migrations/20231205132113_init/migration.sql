-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `neighborhood` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tshirt_size` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `size` VARCHAR(2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tshirt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `price` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `collection` INTEGER NULL,
    `describe_tshirt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tshirt_color` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hexa_decimal` VARCHAR(16) NOT NULL,
    `name_color` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tshirt_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qtd_tshirt` INTEGER NOT NULL,
    `color_id` INTEGER NOT NULL,
    `size_id` INTEGER NOT NULL,
    `tshirt_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tshirt_data` ADD CONSTRAINT `tshirt_data_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `tshirt_color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tshirt_data` ADD CONSTRAINT `tshirt_data_size_id_fkey` FOREIGN KEY (`size_id`) REFERENCES `tshirt_size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tshirt_data` ADD CONSTRAINT `tshirt_data_tshirt_id_fkey` FOREIGN KEY (`tshirt_id`) REFERENCES `tshirt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
