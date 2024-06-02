const controller = require('./nxt-carrinho-controller');
const repository = require('../../repositories/nxt-carrinho-repository/nxt-carrinho-repository');
const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');
jest.mock('../../repositories/nxt-carrinho-repository/nxt-carrinho-repository');
jest.mock('../../services/handleInvalidUser/handleInvalidUser');

const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
};

const error = {
    message: 'error'
};

const next = [];

describe('getProdutosCarrinhoAuth controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [{ id: 'prod1' }];
    const req = {
        params: {
            id: '123',
            rows: 10,
            first: 0,
            id_temp: 'temp123'
        }
    };

    it('Should get produtos carrinho auth successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.getProdutosCarrinho.mockResolvedValue(data);

        await controller.getProdutosCarrinhoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getProdutosCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.getProdutosCarrinho).toHaveBeenCalledWith(req.params.id, req.params.rows, req.params.first, true, req.params.id_temp);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not get produtos carrinho auth if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.getProdutosCarrinhoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getProdutosCarrinho).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when getting produtos carrinho auth', async () => {
        checkUser.mockReturnValue(true);
        repository.getProdutosCarrinho.mockRejectedValue(error);

        await controller.getProdutosCarrinhoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getProdutosCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.getProdutosCarrinho).toHaveBeenCalledWith(req.params.id, req.params.rows, req.params.first, true, req.params.id_temp);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('getProdutosCarrinho controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [{ id: 'prod1' }];
    const req = {
        params: {
            id: '123',
            rows: 10,
            first: 0,
            id_temp: 'temp123'
        }
    };

    it('Should get produtos carrinho successfully', async () => {
        repository.getProdutosCarrinho.mockResolvedValue(data);

        await controller.getProdutosCarrinho(req, res, next);

        expect(repository.getProdutosCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.getProdutosCarrinho).toHaveBeenCalledWith(req.params.id, req.params.rows, req.params.first, false, req.params.id_temp);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should handle error when getting produtos carrinho', async () => {
        repository.getProdutosCarrinho.mockRejectedValue(error);

        await controller.getProdutosCarrinho(req, res, next);

        expect(repository.getProdutosCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.getProdutosCarrinho).toHaveBeenCalledWith(req.params.id, req.params.rows, req.params.first, false, req.params.id_temp);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('deleteProdutoAuth controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { success: true };
    const req = {
        params: {
            id: '123',
            id_produto: 'prod1'
        }
    };

    it('Should delete produto auth successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.deleteProduto.mockResolvedValue(data);

        await controller.deleteProdutoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.deleteProduto).toHaveBeenCalledTimes(1);
        expect(repository.deleteProduto).toHaveBeenCalledWith(req.params.id, req.params.id_produto, true);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not delete produto auth if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.deleteProdutoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.deleteProduto).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when deleting produto auth', async () => {
        checkUser.mockReturnValue(true);
        repository.deleteProduto.mockRejectedValue(error);

        await controller.deleteProdutoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.deleteProduto).toHaveBeenCalledTimes(1);
        expect(repository.deleteProduto).toHaveBeenCalledWith(req.params.id, req.params.id_produto, true);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('deleteProduto controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { success: true };
    const req = {
        params: {
            id: '123',
            id_produto: 'prod1'
        }
    };

    it('Should delete produto successfully', async () => {
        repository.deleteProduto.mockResolvedValue(data);

        await controller.deleteProduto(req, res, next);

        expect(repository.deleteProduto).toHaveBeenCalledTimes(1);
        expect(repository.deleteProduto).toHaveBeenCalledWith(req.params.id, req.params.id_produto, false);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should handle error when deleting produto', async () => {
        repository.deleteProduto.mockRejectedValue(error);

        await controller.deleteProduto(req, res, next);

        expect(repository.deleteProduto).toHaveBeenCalledTimes(1);
        expect(repository.deleteProduto).toHaveBeenCalledWith(req.params.id, req.params.id_produto, false);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('getQuantidadeProdutosAuth controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { quantity: 5 };
    const req = {
        params: {
            id: '123',
            id_temp: 'temp123'
        }
    };

    it('Should get quantidade produtos auth successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.getQuantidadeProdutos.mockResolvedValue(data);

        await controller.getQuantidadeProdutosAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getQuantidadeProdutos).toHaveBeenCalledTimes(1);
        expect(repository.getQuantidadeProdutos).toHaveBeenCalledWith(req.params.id, true, req.params.id_temp);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not get quantidade produtos auth if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.getQuantidadeProdutosAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getQuantidadeProdutos).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when getting quantidade produtos auth', async () => {
        checkUser.mockReturnValue(true);
        repository.getQuantidadeProdutos.mockRejectedValue(error);

        await controller.getQuantidadeProdutosAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getQuantidadeProdutos).toHaveBeenCalledTimes(1);
        expect(repository.getQuantidadeProdutos).toHaveBeenCalledWith(req.params.id, true, req.params.id_temp);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('getQuantidadeProdutos controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { quantity: 5 };
    const req = {
        params: {
            id_temp: 'temp123'
        }
    };

    it('Should get quantidade produtos successfully', async () => {
        repository.getQuantidadeProdutos.mockResolvedValue(data);

        await controller.getQuantidadeProdutos(req, res, next);

        expect(repository.getQuantidadeProdutos).toHaveBeenCalledTimes(1);
        expect(repository.getQuantidadeProdutos).toHaveBeenCalledWith(req.params.id_temp, false, req.params.id_temp);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should handle error when getting quantidade produtos', async () => {
        repository.getQuantidadeProdutos.mockRejectedValue(error);

        await controller.getQuantidadeProdutos(req, res, next);

        expect(repository.getQuantidadeProdutos).toHaveBeenCalledTimes(1);
        expect(repository.getQuantidadeProdutos).toHaveBeenCalledWith(req.params.id_temp, false, req.params.id_temp);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('putQuantidadeProdutoAuth controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { success: true };
    const req = {
        body: {
            id: '123',
            produto: 'prod1',
            quantity: 2
        }
    };

    it('Should update quantidade produto auth successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.putQuantidadeProduto.mockResolvedValue(data);

        await controller.putQuantidadeProdutoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repository.putQuantidadeProduto).toHaveBeenCalledTimes(1);
        expect(repository.putQuantidadeProduto).toHaveBeenCalledWith(req.body.id, req.body.produto, req.body.quantity, true);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not update quantidade produto auth if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.putQuantidadeProdutoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repository.putQuantidadeProduto).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when updating quantidade produto auth', async () => {
        checkUser.mockReturnValue(true);
        repository.putQuantidadeProduto.mockRejectedValue(error);

        await controller.putQuantidadeProdutoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repository.putQuantidadeProduto).toHaveBeenCalledTimes(1);
        expect(repository.putQuantidadeProduto).toHaveBeenCalledWith(req.body.id, req.body.produto, req.body.quantity, true);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('putQuantidadeProduto controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { success: true };
    const req = {
        body: {
            user: 'user123',
            produto: 'prod1',
            quantity: 2
        }
    };

    it('Should update quantidade produto successfully', async () => {
        repository.putQuantidadeProduto.mockResolvedValue(data);

        await controller.putQuantidadeProduto(req, res, next);

        expect(repository.putQuantidadeProduto).toHaveBeenCalledTimes(1);
        expect(repository.putQuantidadeProduto).toHaveBeenCalledWith(req.body.user, req.body.produto, req.body.quantity, false);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should handle error when updating quantidade produto', async () => {
        repository.putQuantidadeProduto.mockRejectedValue(error);

        await controller.putQuantidadeProduto(req, res, next);

        expect(repository.putQuantidadeProduto).toHaveBeenCalledTimes(1);
        expect(repository.putQuantidadeProduto).toHaveBeenCalledWith(req.body.user, req.body.produto, req.body.quantity, false);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('getCarrinhoResumoAuth controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { total: 100 };
    const req = {
        params: {
            id: '123'
        }
    };

    it('Should get carrinho resumo auth successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.getCarrinhoResumo.mockResolvedValue(data);

        await controller.getCarrinhoResumoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getCarrinhoResumo).toHaveBeenCalledTimes(1);
        expect(repository.getCarrinhoResumo).toHaveBeenCalledWith(req.params.id, true);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not get carrinho resumo auth if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.getCarrinhoResumoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getCarrinhoResumo).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when getting carrinho resumo auth', async () => {
        checkUser.mockReturnValue(true);
        repository.getCarrinhoResumo.mockRejectedValue(error);

        await controller.getCarrinhoResumoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getCarrinhoResumo).toHaveBeenCalledTimes(1);
        expect(repository.getCarrinhoResumo).toHaveBeenCalledWith(req.params.id, true);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('getCarrinhoResumo controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { total: 100 };
    const req = {
        params: {
            id: '123'
        }
    };

    it('Should get carrinho resumo successfully', async () => {
        repository.getCarrinhoResumo.mockResolvedValue(data);

        await controller.getCarrinhoResumo(req, res, next);

        expect(repository.getCarrinhoResumo).toHaveBeenCalledTimes(1);
        expect(repository.getCarrinhoResumo).toHaveBeenCalledWith(req.params.id, false);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should handle error when getting carrinho resumo', async () => {
        repository.getCarrinhoResumo.mockRejectedValue(error);

        await controller.getCarrinhoResumo(req, res, next);

        expect(repository.getCarrinhoResumo).toHaveBeenCalledTimes(1);
        expect(repository.getCarrinhoResumo).toHaveBeenCalledWith(req.params.id, false);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('postProdutoCarrinhoAuth controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { success: true };
    const req = {
        body: {
            id: '123',
            prod_id: 'prod1'
        }
    };

    it('Should post produto carrinho auth successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.postProdutoCarrinho.mockResolvedValue(data);

        await controller.postProdutoCarrinhoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repository.postProdutoCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.postProdutoCarrinho).toHaveBeenCalledWith(req.body.id, req.body.prod_id, true);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not post produto carrinho auth if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.postProdutoCarrinhoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repository.postProdutoCarrinho).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when posting produto carrinho auth', async () => {
        checkUser.mockReturnValue(true);
        repository.postProdutoCarrinho.mockRejectedValue(error);

        await controller.postProdutoCarrinhoAuth(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repository.postProdutoCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.postProdutoCarrinho).toHaveBeenCalledWith(req.body.id, req.body.prod_id, true);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('postProdutoCarrinho controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { success: true };
    const req = {
        body: {
            id: '123',
            prod_id: 'prod1'
        }
    };

    it('Should post produto carrinho successfully', async () => {
        repository.postProdutoCarrinho.mockResolvedValue(data);

        await controller.postProdutoCarrinho(req, res, next);

        expect(repository.postProdutoCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.postProdutoCarrinho).toHaveBeenCalledWith(req.body.id, req.body.prod_id, false);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should handle error when posting produto carrinho', async () => {
        repository.postProdutoCarrinho.mockRejectedValue(error);

        await controller.postProdutoCarrinho(req, res, next);

        expect(repository.postProdutoCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.postProdutoCarrinho).toHaveBeenCalledWith(req.body.id, req.body.prod_id, false);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});
