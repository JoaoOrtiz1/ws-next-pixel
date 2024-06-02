const controller = require('./nxt-usuario-controller');
const repository = require('../../repositories/nxt-usuario-repository/nxt-usuario-repository');
const { checkUser } = require('../../services/handleInvalidUser/handleInvalidUser');
jest.mock('../../repositories/nxt-usuario-repository/nxt-usuario-repository');
jest.mock('../../services/handleInvalidUser/handleInvalidUser');

const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
};

const error = {
    message: 'error'
};

const next = [];

describe('getUsuario controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = {};
    const req = {
        params: {
            id: 'user|123'
        }
    };

    it('Should get usuario successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.getUsuario.mockResolvedValue(data);

        await controller.getUsuario(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, '123');
        expect(repository.getUsuario).toHaveBeenCalledTimes(1);
        expect(repository.getUsuario).toHaveBeenCalledWith(req.params.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not get usuario if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.getUsuario(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, '123');
        expect(repository.getUsuario).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when getting usuario', async () => {
        checkUser.mockReturnValue(true);
        repository.getUsuario.mockRejectedValue(error);

        await controller.getUsuario(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, '123');
        expect(repository.getUsuario).toHaveBeenCalledTimes(1);
        expect(repository.getUsuario).toHaveBeenCalledWith(req.params.id);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});

describe('postUsuario controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = {};
    const req = {
        body: {
            user: {
                sub: 'user|123',
                nickname: 'nickname123',
                email: 'email@example.com'
            }
        }
    };

    it('Should post usuario successfully', async () => {
        checkUser.mockReturnValue(true);
        repository.postUsuario.mockResolvedValue(data);

        await controller.postUsuario(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, '123');
        expect(repository.postUsuario).toHaveBeenCalledTimes(1);
        expect(repository.postUsuario).toHaveBeenCalledWith(
            req.body.user.sub,
            req.body.user.nickname,
            req.body.user.email
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    });

    it('Should not post usuario if user check fails', async () => {
        checkUser.mockReturnValue(false);

        await controller.postUsuario(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, '123');
        expect(repository.postUsuario).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('Should handle error when posting usuario', async () => {
        checkUser.mockReturnValue(true);
        repository.postUsuario.mockRejectedValue(error);

        await controller.postUsuario(req, res, next);

        expect(checkUser).toHaveBeenCalledWith(req, res, '123');
        expect(repository.postUsuario).toHaveBeenCalledTimes(1);
        expect(repository.postUsuario).toHaveBeenCalledWith(
            req.body.user.sub,
            req.body.user.nickname,
            req.body.user.email
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    });
});
