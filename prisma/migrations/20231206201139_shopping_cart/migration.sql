-- CreateTable
CREATE TABLE `shopping_cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `clothing_id` INTEGER NOT NULL,
    `color_id` INTEGER NOT NULL,
    `size_id` INTEGER NOT NULL,
    `qtd_parts` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shopping_cart` ADD CONSTRAINT `shopping_cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shopping_cart` ADD CONSTRAINT `shopping_cart_clothing_id_fkey` FOREIGN KEY (`clothing_id`) REFERENCES `clothing_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shopping_cart` ADD CONSTRAINT `shopping_cart_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `parts_color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shopping_cart` ADD CONSTRAINT `shopping_cart_size_id_fkey` FOREIGN KEY (`size_id`) REFERENCES `parts_size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
