-- CreateTable
CREATE TABLE `Pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `locacaoId` INTEGER NOT NULL,
    `valor` DOUBLE NOT NULL,
    `dataPagamento` DATETIME(3) NOT NULL,
    `metodoPagamento` ENUM('CARTAO_CREDITO', 'CARTAO_DEBITO', 'DINHEIRO', 'TRANSFERENCIA') NOT NULL,
    `statusPagamento` ENUM('PENDENTE', 'PAGO', 'CANCELADO', 'FALHOU') NOT NULL,

    UNIQUE INDEX `Pagamento_locacaoId_key`(`locacaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_locacaoId_fkey` FOREIGN KEY (`locacaoId`) REFERENCES `Locacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
