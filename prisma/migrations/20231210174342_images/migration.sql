-- CreateTable
CREATE TABLE `images_clothing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image_name` VARCHAR(1000) NOT NULL,
    `clothing_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `images_clothing` ADD CONSTRAINT `images_clothing_clothing_id_fkey` FOREIGN KEY (`clothing_id`) REFERENCES `clothing_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
