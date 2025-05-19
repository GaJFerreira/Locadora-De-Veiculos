-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `tipoUsuario` ENUM('ADMIN', 'CLIENTE') NOT NULL,
    `cnh` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    UNIQUE INDEX `Usuario_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Veiculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modelo` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `ano` INTEGER NOT NULL,
    `cor` VARCHAR(191) NOT NULL,
    `placa` VARCHAR(191) NOT NULL,
    `renavam` VARCHAR(191) NOT NULL,
    `chasis` VARCHAR(191) NOT NULL,
    `quilometragem` INTEGER NOT NULL,
    `valorFipe` DOUBLE NOT NULL,
    `tipoVeiculo` ENUM('CARRO', 'MOTO') NOT NULL,

    UNIQUE INDEX `Veiculo_placa_key`(`placa`),
    UNIQUE INDEX `Veiculo_renavam_key`(`renavam`),
    UNIQUE INDEX `Veiculo_chasis_key`(`chasis`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Locacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `veiculoId` INTEGER NOT NULL,
    `dataLocacao` DATETIME(3) NOT NULL,
    `dataDevolucao` DATETIME(3) NOT NULL,
    `localRetirada` VARCHAR(191) NOT NULL,
    `localDevolucao` VARCHAR(191) NOT NULL,
    `valorTotal` DOUBLE NOT NULL,
    `statusLocacao` ENUM('PENDENTE', 'FINALIZADA', 'CANCELADA') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Locacao` ADD CONSTRAINT `Locacao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Locacao` ADD CONSTRAINT `Locacao_veiculoId_fkey` FOREIGN KEY (`veiculoId`) REFERENCES `Veiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_locacaoId_fkey` FOREIGN KEY (`locacaoId`) REFERENCES `Locacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
