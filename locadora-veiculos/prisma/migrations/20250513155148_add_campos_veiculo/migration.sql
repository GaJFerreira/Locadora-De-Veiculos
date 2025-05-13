/*
  Warnings:

  - A unique constraint covering the columns `[renavam]` on the table `Veiculo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chasis]` on the table `Veiculo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chasis` to the `Veiculo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quilometragem` to the `Veiculo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renavam` to the `Veiculo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorFipe` to the `Veiculo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Veiculo` ADD COLUMN `chasis` VARCHAR(191) NOT NULL,
    ADD COLUMN `quilometragem` INTEGER NOT NULL,
    ADD COLUMN `renavam` VARCHAR(191) NOT NULL,
    ADD COLUMN `valorFipe` DOUBLE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Veiculo_renavam_key` ON `Veiculo`(`renavam`);

-- CreateIndex
CREATE UNIQUE INDEX `Veiculo_chasis_key` ON `Veiculo`(`chasis`);
