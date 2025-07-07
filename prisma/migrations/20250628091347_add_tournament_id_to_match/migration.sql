/*
  Warnings:

  - Added the required column `tournament_id` to the `match` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `category_age_group_id_fkey` ON `category`;

-- DropIndex
DROP INDEX `category_tournament_id_fkey` ON `category`;

-- DropIndex
DROP INDEX `category_weight_category_id_fkey` ON `category`;

-- DropIndex
DROP INDEX `competitor_user_id_fkey` ON `competitor`;

-- DropIndex
DROP INDEX `match_category_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_competitor1_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_competitor2_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_winner_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `tournament_user_id_fkey` ON `tournament`;

-- DropIndex
DROP INDEX `weight_category_age_group_id_fkey` ON `weight_category`;

-- AlterTable
ALTER TABLE `match` ADD COLUMN `tournament_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `tournament` ADD CONSTRAINT `tournament_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competitor` ADD CONSTRAINT `competitor_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weight_category` ADD CONSTRAINT `weight_category_age_group_id_fkey` FOREIGN KEY (`age_group_id`) REFERENCES `age_group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_tournament_id_fkey` FOREIGN KEY (`tournament_id`) REFERENCES `tournament`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_weight_category_id_fkey` FOREIGN KEY (`weight_category_id`) REFERENCES `weight_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_age_group_id_fkey` FOREIGN KEY (`age_group_id`) REFERENCES `age_group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_tournament_id_fkey` FOREIGN KEY (`tournament_id`) REFERENCES `tournament`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_competitor1_id_fkey` FOREIGN KEY (`competitor1_id`) REFERENCES `competitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_competitor2_id_fkey` FOREIGN KEY (`competitor2_id`) REFERENCES `competitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_winner_id_fkey` FOREIGN KEY (`winner_id`) REFERENCES `competitor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
