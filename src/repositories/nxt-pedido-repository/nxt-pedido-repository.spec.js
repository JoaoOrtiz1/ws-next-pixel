const repository = require('./nxt-pedido-repository');
const db = require('../../../config/database/database');
const carrinhoRepository = require('../nxt-carrinho-repository/nxt-carrinho-repository');

jest.mock('../../../config/database/database');
jest.mock('../nxt-carrinho-repository/nxt-carrinho-repository');

describe('postOrder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should post an order with the correct SQL queries and parameters', async () => {
        const nextPedidoMock = { rows: [{ next_pedido: 1 }] };
        const postOrderMock = { rowCount: 1 };
        const produtosPedidoMock = { rowCount: 1 };
        
        db.query.mockResolvedValueOnce({ rowCount: 1 }); // BEGIN
        db.query.mockResolvedValueOnce(nextPedidoMock); // SELECT COALESCE
        db.query.mockResolvedValueOnce(postOrderMock); // INSERT INTO sys_pedido
        db.query.mockResolvedValueOnce(produtosPedidoMock); // INSERT INTO sys_pedido_produto
        db.query.mockResolvedValueOnce({ rowCount: 1 }); // COMMIT
        carrinhoRepository.deleteProduto.mockResolvedValueOnce({ rowCount: 1 }); // DELETE FROM carrinho
        
        const result = await repository.postOrder(11111, 100, 1);

        expect(db.query).toHaveBeenCalledTimes(5);
        expect(carrinhoRepository.deleteProduto).toHaveBeenCalledTimes(1);
        expect(result).toEqual(postOrderMock);
    });

    it('should handle and throw errors and rollback the transaction', async () => {
        db.query.mockResolvedValueOnce({ rowCount: 1 }); // BEGIN
        db.query.mockRejectedValueOnce(new Error('Error')); // Error on SELECT COALESCE
        db.query.mockResolvedValueOnce({ rowCount: 1 }); // ROLLBACK
        
        await expect(repository.postOrder('user123', 100, 'address123')).rejects.toThrow('Error');
        
        expect(db.query).toHaveBeenCalledTimes(3); // BEGIN, SELECT COALESCE, ROLLBACK
    });
});

describe('getPedidos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch orders with the correct SQL query and parameters', async () => {
        const mockData = {
            rows: [
                {
                    ped_co_pedido: 1,
                    ped_in_status: 'C',
                    ped_dt_pedido: '2024-01-01',
                    ped_vl_pedido: 100,
                    endc_co_endereco: 'address123',
                    total_records: 1
                }
            ]
        };

        db.query.mockResolvedValue(mockData);

        const result = await repository.getPedidos('user123', 0, 10);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('SELECT ped_co_pedido, ped_in_status, ped_dt_pedido, ped_vl_pedido, endc_co_endereco, COUNT (*) OVER () as total_records FROM sys_pedido WHERE usu_co_usuario = $1 LIMIT $2 OFFSET $3');
        expect(db.query.mock.calls[0][1]).toEqual(['user123', 10, 0]);
        expect(result).toEqual(mockData.rows);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getPedidos('user123', 0, 10)).rejects.toThrow('Error');
    });
});

describe('getPedidoProduto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch order products with the correct SQL query and parameters', async () => {
        const mockData = {
            rows: [
                {
                    prod_co_produto: 1,
                    prod_no_produto: 'Product 1',
                    prod_qt_produto: 2,
                    prod_vl_preco: 50,
                    prod_vl_total: 100,
                    total_records: 1
                }
            ]
        };

        db.query.mockResolvedValue(mockData);

        const result = await repository.getPedidoProduto('user123', 1, 0, 10);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('SELECT prod.prod_co_produto, prod.prod_no_produto, pedp.prod_qt_produto, prod.prod_vl_preco, prod.prod_vl_preco*pedp.prod_qt_produto as prod_vl_total, COUNT(*) OVER () as total_records FROM sys_pedido ped INNER JOIN sys_pedido_produto pedp ON ped.ped_co_pedido = pedp.ped_co_pedido INNER JOIN sys_produto prod on pedp.prod_co_produto = prod.prod_co_produto WHERE ped.ped_co_pedido = $1 and ped.usu_co_usuario = $2 LIMIT $3 OFFSET $4');
        expect(db.query.mock.calls[0][1]).toEqual([1, 'user123', 10, 0]);
        expect(result).toEqual(mockData.rows);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getPedidoProduto('user123', 1, 0, 10)).rejects.toThrow('Error');
    });
});
