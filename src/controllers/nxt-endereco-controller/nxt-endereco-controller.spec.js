const controller = require('./nxt-endereco-controller');
const repository = require('../../repositories/nxt-endereco-repository/nxt-endereco-repository');
const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');
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

describe('getEnderecos controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [{ id: 'end1' }];
    const dataFull = [{ id: 'end1', full: 'full address' }];
    const req = {
        params: {
            id: '123',
            query: 'some query'
        }
    };

    it('Should get enderecos successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.getEnderecosCarrinho.mockResolvedValue(data);
        repository.getEnderecosFull.mockResolvedValue(dataFull);

        await controller.getEnderecos(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getEnderecosCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.getEnderecosCarrinho).toHaveBeenCalledWith(req.params.id, req.params.query);
        expect(repository.getEnderecosFull).toHaveBeenCalledTimes(1);
        expect(repository.getEnderecosFull).toHaveBeenCalledWith(data);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(dataFull);
    });

    it('Should not get enderecos if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.getEnderecos(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getEnderecosCarrinho).not.toHaveBeenCalled();
        expect(repository.getEnderecosFull).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when getting enderecos', async () => {
        checkUser.mockReturnValue(true);
        repository.getEnderecosCarrinho.mockRejectedValue(error);

        await controller.getEnderecos(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.params.id);
        expect(repository.getEnderecosCarrinho).toHaveBeenCalledTimes(1);
        expect(repository.getEnderecosCarrinho).toHaveBeenCalledWith(req.params.id, req.params.query);
        expect(repository.getEnderecosFull).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});
