/*
  Warnings:

  - Added the required column `localDevolucao` to the `Locacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localRetirada` to the `Locacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Locacao` ADD COLUMN `localDevolucao` VARCHAR(191) NOT NULL,
    ADD COLUMN `localRetirada` VARCHAR(191) NOT NULL;
