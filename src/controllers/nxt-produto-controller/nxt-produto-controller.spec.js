const controller = require('./nxt-produto-controller');
const repository = require("../../repositories/nxt-produto-repository/nxt-produto-repository");
jest.mock('../../repositories/nxt-produto-repository/nxt-produto-repository');

const res = {
    status: jest.fn().mockReturnThis(), // retorna a propria instancia para poder testar
    send: jest.fn()
}

const error = {
    message: 'error'
}

const next = [];

describe('getProdutos controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    const data = [];
    const req = {
        body:{
            first: 0,
            rows: 10,
            prod_no_produto: undefined,
            prod_vl_preco_min: undefined,
            prod_vl_preco_max: undefined,
            prod_dt_cadastro_ini: undefined,
            prod_dt_cadastro_fim: undefined,
            prod_in_status: 'A',
        }
    }

    it('Should get produtos successfully', async () => {
        repository.getProdutos.mockResolvedValue(data); // resolve o repository com valor [] para somente testar o controller

        await controller.getProdutos(req, res, next);

        expect(repository.getProdutos).toHaveBeenCalledTimes(1);
        expect(repository.getProdutos).toHaveBeenCalledWith(
            req.body.prod_no_produto,
            req.body.prod_vl_preco_min,
            req.body.prod_vl_preco_max,
            req.body.prod_dt_cadastro_ini,
            req.body.prod_dt_cadastro_fim,
            req.body.prod_in_status,
            req.body.first,
            req.body.rows
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    })

    it('Should not get produtos successfully', async () => {
        
        repository.getProdutos.mockRejectedValue(error);
        await controller.getProdutos(req, res, next);

        expect(repository.getProdutos).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    })
});

describe('getProduto controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    const req = {
        params: {
            id: 1
        }
    }

    const data = [];

    it('Should get produto successfully', async () => {
        repository.getProduto.mockResolvedValue([]);

        await controller.getProduto(req, res, next)

        expect(repository.getProduto).toHaveBeenCalledTimes(1);
        expect(repository.getProduto).toHaveBeenCalledWith(req.params.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(data);
    })


    it('Should not get produto successfully', async () => {
        repository.getProduto.mockRejectedValue(error);

        await controller.getProduto(req, res, next)

        expect(repository.getProduto).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: error,
            message: error.message
        });
    })

})

