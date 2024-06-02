const controller = require('./nxt-meu-perfil-controller');
const repositoryUser = require('../../repositories/nxt-usuario-repository/nxt-usuario-repository');
const repositoryPedido = require('../../repositories/nxt-pedido-repository/nxt-pedido-repository');
const repositoryEndereco = require('../../repositories/nxt-endereco-repository/nxt-endereco-repository');
const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');
jest.mock('../../repositories/nxt-usuario-repository/nxt-usuario-repository');
jest.mock('../../repositories/nxt-pedido-repository/nxt-pedido-repository');
jest.mock('../../repositories/nxt-endereco-repository/nxt-endereco-repository');
jest.mock('../../services/handleInvalidUser/handleInvalidUser');

const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
};

const error = {
    message: 'error'
};

const next = [];

describe('putUser controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [];
    const req = {
        body: {
            id: 123,
            nome: 'John Doe',
            email: 'johndoe@example.com',
            status: 'A',
            
        },
        auth: {
                sub: 'user|123'
            }
    };

    it('Should update user successfully', async () => {
        checkUser.mockReturnValue(true);
        repositoryUser.putUser.mockResolvedValue(data);

        await controller.putUser(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repositoryUser.putUser).toHaveBeenCalledTimes(1);
        expect(repositoryUser.putUser).toHaveBeenCalledWith(
            req.body.id,
            req.body.nome,
            req.body.email,
            req.body.status,
            req.auth.sub
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not update user if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.putUser(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repositoryUser.putUser).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when updating user', async () => {
        checkUser.mockReturnValue(true);
        repositoryUser.putUser.mockRejectedValue(error);

        await controller.putUser(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repositoryUser.putUser).toHaveBeenCalledTimes(1);
        expect(repositoryUser.putUser).toHaveBeenCalledWith(
            req.body.id,
            req.body.nome,
            req.body.email,
            req.body.status,
            req.auth.sub
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('getPedidos controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [];
    const req = {
        params: {
            id: '123',
            first: 0,
            rows: 10
        }
    };

    it('Should get pedidos successfully', async () => {
        checkUser.mockReturnValue(true);
        repositoryPedido.getPedidos.mockResolvedValue(data);

        await controller.getPedidos(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryPedido.getPedidos).toHaveBeenCalledTimes(1);
        expect(repositoryPedido.getPedidos).toHaveBeenCalledWith(req.params.id, req.params.first, req.params.rows);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not get pedidos if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.getPedidos(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryPedido.getPedidos).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when getting pedidos', async () => {
        checkUser.mockReturnValue(true);
        repositoryPedido.getPedidos.mockRejectedValue(error);

        await controller.getPedidos(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryPedido.getPedidos).toHaveBeenCalledTimes(1);
        expect(repositoryPedido.getPedidos).toHaveBeenCalledWith(req.params.id, req.params.first, req.params.rows);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('getPedidoProduto controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [{}];
    const req = {
        params: {
            id: '123',
            id_pedido: '456',
            first: 0,
            rows: 10,
            id_endc: '789'
        }
    };
    const endc = {};
    const endcFull = [{ optionLabel: 'address label' }];

    it('Should get pedido produto successfully', async () => {
        checkUser.mockReturnValue(true);
        repositoryPedido.getPedidoProduto.mockResolvedValue(data);
        repositoryEndereco.getEndereco.mockResolvedValue(endc);
        repositoryEndereco.getEnderecosFull.mockResolvedValue(endcFull);

        await controller.getPedidoProduto(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryPedido.getPedidoProduto).toHaveBeenCalledTimes(1);
        expect(repositoryPedido.getPedidoProduto).toHaveBeenCalledWith(req.params.id, req.params.id_pedido, req.params.first, req.params.rows);
        expect(repositoryEndereco.getEndereco).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.getEndereco).toHaveBeenCalledWith(req.params.id, req.params.id_endc);
        expect(repositoryEndereco.getEnderecosFull).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.getEnderecosFull).toHaveBeenCalledWith(endc);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not get pedido produto if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.getPedidoProduto(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryPedido.getPedidoProduto).not.toHaveBeenCalled();
        expect(repositoryEndereco.getEndereco).not.toHaveBeenCalled();
        expect(repositoryEndereco.getEnderecosFull).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when getting pedido produto', async () => {
        checkUser.mockReturnValue(true);
        repositoryPedido.getPedidoProduto.mockRejectedValue(error);

        await controller.getPedidoProduto(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryPedido.getPedidoProduto).toHaveBeenCalledTimes(1);
        expect(repositoryPedido.getPedidoProduto).toHaveBeenCalledWith(req.params.id, req.params.id_pedido, req.params.first, req.params.rows);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('getEnderecos controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [];
    const req = {
        params: {
            id: '123',
            first: 0,
            rows: 10
        }
    };

    it('Should get enderecos successfully', async () => {
        checkUser.mockReturnValue(true);
        repositoryEndereco.getEnderecos.mockResolvedValue(data);

        await controller.getEnderecos(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryEndereco.getEnderecos).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.getEnderecos).toHaveBeenCalledWith(req.params.id, req.params.first, req.params.rows);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not get enderecos if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.getEnderecos(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryEndereco.getEnderecos).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when getting enderecos', async () => {
        checkUser.mockReturnValue(true);
        repositoryEndereco.getEnderecos.mockRejectedValue(error);

        await controller.getEnderecos(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryEndereco.getEnderecos).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.getEnderecos).toHaveBeenCalledWith(req.params.id, req.params.first, req.params.rows);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('deleteEndereco controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = {};
    const req = {
        params: {
            id: '123',
            id_endc: '456'
        }
    };

    it('Should delete endereco successfully', async () => {
        checkUser.mockReturnValue(true);
        repositoryEndereco.deleteEndereco.mockResolvedValue(data);

        await controller.deleteEndereco(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryEndereco.deleteEndereco).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.deleteEndereco).toHaveBeenCalledWith(req.params.id, req.params.id_endc);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not delete endereco if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.deleteEndereco(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryEndereco.deleteEndereco).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when deleting endereco', async () => {
        checkUser.mockReturnValue(true);
        repositoryEndereco.deleteEndereco.mockRejectedValue(error);

        await controller.deleteEndereco(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repositoryEndereco.deleteEndereco).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.deleteEndereco).toHaveBeenCalledWith(req.params.id, req.params.id_endc);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.code == 23503 ? 'Endereço relacionado a um pedido existente! Tente altera-lo ou criar outro.' : error.message
        });
    });
});

describe('postEndereco controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = {};
    const req = {
        body: {
            id: '123',
            cep: '12345-678',
            estado: 'SP',
            cidade: 'São Paulo',
            numero: '1000',
            apelido: 'casa',
            bairro: 'Centro',
            recebe: 'John Doe',
            rua: 'Rua Exemplo'
        }
    };

    it('Should post endereco successfully', async () => {
        checkUser.mockReturnValue(true);
        repositoryEndereco.postEndereco.mockResolvedValue(data);

        await controller.postEndereco(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repositoryEndereco.postEndereco).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.postEndereco).toHaveBeenCalledWith(
            req.body.id,
            req.body.cep,
            req.body.estado,
            req.body.cidade,
            req.body.numero,
            req.body.apelido,
            req.body.bairro,
            req.body.recebe,
            req.body.rua
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not post endereco if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.postEndereco(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repositoryEndereco.postEndereco).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when posting endereco', async () => {
        checkUser.mockReturnValue(true);
        repositoryEndereco.postEndereco.mockRejectedValue(error);

        await controller.postEndereco(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repositoryEndereco.postEndereco).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.postEndereco).toHaveBeenCalledWith(
            req.body.id,
            req.body.cep,
            req.body.estado,
            req.body.cidade,
            req.body.numero,
            req.body.apelido,
            req.body.bairro,
            req.body.recebe,
            req.body.rua
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('putEndereco controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = {};
    const req = {
        body: {
            id: '123',
            id_endc: '456',
            cep: '12345-678',
            estado: 'SP',
            cidade: 'São Paulo',
            numero: '1000',
            apelido: 'casa',
            bairro: 'Centro',
            recebe: 'John Doe',
            rua: 'Rua Exemplo'
        }
    };

    it('Should update endereco successfully', async () => {
        checkUser.mockReturnValue(true);
        repositoryEndereco.putEndereco.mockResolvedValue(data);

        await controller.putEndereco(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repositoryEndereco.putEndereco).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.putEndereco).toHaveBeenCalledWith(
            req.body.id_endc,
            req.body.id,
            req.body.cep,
            req.body.estado,
            req.body.cidade,
            req.body.numero,
            req.body.apelido,
            req.body.bairro,
            req.body.recebe,
            req.body.rua
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not update endereco if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.putEndereco(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repositoryEndereco.putEndereco).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when updating endereco', async () => {
        checkUser.mockReturnValue(true);
        repositoryEndereco.putEndereco.mockRejectedValue(error);

        await controller.putEndereco(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.id);
        expect(repositoryEndereco.putEndereco).toHaveBeenCalledTimes(1);
        expect(repositoryEndereco.putEndereco).toHaveBeenCalledWith(
            req.body.id_endc,
            req.body.id,
            req.body.cep,
            req.body.estado,
            req.body.cidade,
            req.body.numero,
            req.body.apelido,
            req.body.bairro,
            req.body.recebe,
            req.body.rua
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});
