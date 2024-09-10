/*
  Warnings:

  - A unique constraint covering the columns `[id_eleve,id_enseignant,id_matiere,id_trimestre,devoir]` on the table `Note_devoir` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_eleve,id_enseignant,id_matiere,id_trimestre,inter]` on the table `Note_inter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_eleve,id_matiere,id_trimestre]` on the table `Rang` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Note_devoir_id_eleve_id_enseignant_id_matiere_id_trimestre_d_key` ON `Note_devoir`(`id_eleve`, `id_enseignant`, `id_matiere`, `id_trimestre`, `devoir`);

-- CreateIndex
CREATE UNIQUE INDEX `Note_inter_id_eleve_id_enseignant_id_matiere_id_trimestre_in_key` ON `Note_inter`(`id_eleve`, `id_enseignant`, `id_matiere`, `id_trimestre`, `inter`);

-- CreateIndex
CREATE UNIQUE INDEX `Rang_id_eleve_id_matiere_id_trimestre_key` ON `Rang`(`id_eleve`, `id_matiere`, `id_trimestre`);
