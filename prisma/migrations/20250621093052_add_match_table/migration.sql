-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tournament` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `club` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competitor` (
    `id` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `club` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `weight` INTEGER NOT NULL,
    `rank` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `age_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `age_min` INTEGER NOT NULL,
    `age_max` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weight_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `weight_min` INTEGER NOT NULL,
    `weight_max` INTEGER NOT NULL,
    `age_group_id` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `rank` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `tournament_id` VARCHAR(191) NOT NULL,
    `weight_category_id` INTEGER NOT NULL,
    `age_group_id` INTEGER NOT NULL,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `round` INTEGER NOT NULL,
    `competitor1_id` VARCHAR(191) NOT NULL,
    `competitor2_id` VARCHAR(191) NOT NULL,
    `score1` INTEGER NOT NULL DEFAULT 0,
    `score2` INTEGER NOT NULL DEFAULT 0,
    `winner_id` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `match` ADD CONSTRAINT `match_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_competitor1_id_fkey` FOREIGN KEY (`competitor1_id`) REFERENCES `competitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_competitor2_id_fkey` FOREIGN KEY (`competitor2_id`) REFERENCES `competitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_winner_id_fkey` FOREIGN KEY (`winner_id`) REFERENCES `competitor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
