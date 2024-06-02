-- CreateTable
CREATE TABLE "sys_carrinho" (
    "car_co_carrinho" BIGINT NOT NULL,
    "usu_co_usuario" DECIMAL,
    "car_co_temp_id" VARCHAR(50),
    "car_dt_cadastro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_carrinho_pkey" PRIMARY KEY ("car_co_carrinho")
);

-- CreateTable
CREATE TABLE "sys_carrinho_produto" (
    "car_co_carrinho" BIGINT NOT NULL,
    "prod_co_produto" BIGINT NOT NULL,
    "prod_qt_produto" INTEGER,

    CONSTRAINT "pk_carrinho_produtos" PRIMARY KEY ("car_co_carrinho","prod_co_produto")
);

-- CreateTable
CREATE TABLE "sys_endereco" (
    "endc_co_endereco" BIGINT NOT NULL,
    "usu_co_usuario" DECIMAL,
    "endc_co_cep" BIGINT,
    "endc_co_estado" VARCHAR(2),
    "endc_nu_cidade" VARCHAR(50),
    "endc_nu_numero" SMALLINT,
    "endc_no_apelido" VARCHAR(60),

    CONSTRAINT "sys_endereco_pkey" PRIMARY KEY ("endc_co_endereco")
);

-- CreateTable
CREATE TABLE "sys_pedido" (
    "ped_co_pedido" BIGINT NOT NULL,
    "usu_co_usuario" DECIMAL,
    "ped_dt_pedido" TIMESTAMP(6),
    "ped_vl_pedido" DECIMAL,
    "endc_co_endereco" BIGINT,
    "ped_in_status" CHAR(1),

    CONSTRAINT "sys_pedido_pkey" PRIMARY KEY ("ped_co_pedido")
);

-- CreateTable
CREATE TABLE "sys_pedido_produto" (
    "ped_co_pedido" BIGINT NOT NULL,
    "prod_co_produto" BIGINT NOT NULL,
    "prod_qt_produto" BIGINT,

    CONSTRAINT "sys_pedido_produto_pkey" PRIMARY KEY ("ped_co_pedido","prod_co_produto")
);

-- CreateTable
CREATE TABLE "sys_produto" (
    "prod_co_produto" BIGINT NOT NULL,
    "prod_no_produto" VARCHAR(100),
    "prod_tx_descricao" VARCHAR(2500),
    "prod_vl_preco" DECIMAL,
    "prod_no_estoque" INTEGER,
    "prod_in_status" VARCHAR(1),
    "prod_path_url_thumbnail" VARCHAR(20),
    "prod_url_3d" VARCHAR(500),
    "prod_dt_cadastro" TIMESTAMP(6),

    CONSTRAINT "sys_produto_pkey" PRIMARY KEY ("prod_co_produto")
);

-- CreateTable
CREATE TABLE "sys_usuario" (
    "usu_co_usuario" DECIMAL NOT NULL,
    "usu_no_usuario" VARCHAR(60),
    "usu_no_email" VARCHAR(100),
    "usu_in_status" CHAR(1),

    CONSTRAINT "sys_usuario_pkey" PRIMARY KEY ("usu_co_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_usuario_usu_no_email_key" ON "sys_usuario"("usu_no_email");

-- AddForeignKey
ALTER TABLE "sys_carrinho" ADD CONSTRAINT "fk_usuario" FOREIGN KEY ("usu_co_usuario") REFERENCES "sys_usuario"("usu_co_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sys_carrinho_produto" ADD CONSTRAINT "fk_carrinho" FOREIGN KEY ("car_co_carrinho") REFERENCES "sys_carrinho"("car_co_carrinho") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sys_carrinho_produto" ADD CONSTRAINT "fk_produto" FOREIGN KEY ("prod_co_produto") REFERENCES "sys_produto"("prod_co_produto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sys_endereco" ADD CONSTRAINT "fk_usuario" FOREIGN KEY ("usu_co_usuario") REFERENCES "sys_usuario"("usu_co_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sys_pedido" ADD CONSTRAINT "sys_pedido_endc_co_endereco_fkey" FOREIGN KEY ("endc_co_endereco") REFERENCES "sys_endereco"("endc_co_endereco") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sys_pedido" ADD CONSTRAINT "sys_pedido_usu_co_usuario_fkey" FOREIGN KEY ("usu_co_usuario") REFERENCES "sys_usuario"("usu_co_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sys_pedido_produto" ADD CONSTRAINT "sys_pedido_produto_ped_co_pedido_fkey" FOREIGN KEY ("ped_co_pedido") REFERENCES "sys_pedido"("ped_co_pedido") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sys_pedido_produto" ADD CONSTRAINT "sys_pedido_produto_prod_co_produto_fkey" FOREIGN KEY ("prod_co_produto") REFERENCES "sys_produto"("prod_co_produto") ON DELETE NO ACTION ON UPDATE NO ACTION;
