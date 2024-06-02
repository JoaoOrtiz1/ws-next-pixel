const controller = require('./nxt-pedido-controller');
const repository = require('../../repositories/nxt-pedido-repository/nxt-pedido-repository');
const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');
jest.mock('../../repositories/nxt-pedido-repository/nxt-pedido-repository');
jest.mock('../../services/handleInvalidUser/handleInvalidUser');

const res = {
    status: jest.fn().mockReturnThis(), // retorna a propria instancia para poder testar
    send: jest.fn()
};

const error = {
    message: 'error'
};

const next = [];

describe('postOrder controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [];
    const req = {
        body: {
            user: 111111,
            valor: 100,
            selectedEndc: 1
        }
    };

    it('Should post order successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.postOrder.mockResolvedValue(data);

        await controller.postOrder(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.user);
        expect(repository.postOrder).toHaveBeenCalledTimes(1);
        expect(repository.postOrder).toHaveBeenCalledWith(req.body.user, req.body.valor, req.body.selectedEndc);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not post order if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.postOrder(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.user);
        expect(repository.postOrder).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when posting order', async () => {
        checkUser.mockReturnValue(true);
        repository.postOrder.mockRejectedValue(error);

        await controller.postOrder(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, req.body.user);
        expect(repository.postOrder).toHaveBeenCalledTimes(1);
        expect(repository.postOrder).toHaveBeenCalledWith(req.body.user, req.body.valor, req.body.selectedEndc);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});
