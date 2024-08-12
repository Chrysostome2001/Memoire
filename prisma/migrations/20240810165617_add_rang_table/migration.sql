-- CreateTable
CREATE TABLE `Rang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `rang` INTEGER NOT NULL,
    `id_matiere` INTEGER NOT NULL,
    `id_eleve` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rang` ADD CONSTRAINT `Rang_id_matiere_fkey` FOREIGN KEY (`id_matiere`) REFERENCES `Matiere`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rang` ADD CONSTRAINT `Rang_id_eleve_fkey` FOREIGN KEY (`id_eleve`) REFERENCES `Eleve`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
