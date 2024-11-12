/*
  Warnings:

  - A unique constraint covering the columns `[id_eleve,id_matiere,id_trimestre]` on the table `Rang` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Rang_id_eleve_id_matiere_id_trimestre_key` ON `Rang`(`id_eleve`, `id_matiere`, `id_trimestre`);
