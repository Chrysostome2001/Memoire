/*
  Warnings:

  - Added the required column `id_trimestre` to the `Rang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Rang` ADD COLUMN `id_trimestre` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Rang` ADD CONSTRAINT `Rang_id_trimestre_fkey` FOREIGN KEY (`id_trimestre`) REFERENCES `Trimestre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
