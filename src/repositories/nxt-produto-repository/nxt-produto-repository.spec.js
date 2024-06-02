const repository = require('./nxt-produto-repository');
const db = require('../../../config/database/database');
const firebase = require('../../services/firebase/firebase-service');

jest.mock('../../../config/database/database');
jest.mock('../../services/firebase/firebase-service');

describe('getProdutos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch products with correct SQL query and parameters', async () => {
        const mockData = {
            rows: [
                {
                    prod_co_produto: 1,
                    prod_no_produto: 'teste',
                    prod_url_3d: 'teste',
                    prod_vl_preco: 100,
                    prod_path_url_thumbnail: '1',
                    total_records: 6
                }
            ]
        };

        db.query.mockResolvedValue(mockData);
        firebase.getFirebaseImage.mockResolvedValue('2');

        const result = await repository.getProdutos('teste', 100, 400, '2021-01-01', '2024-12-31', 'A', 0, 10);

        expect(db.query).toHaveBeenCalled();

        // Verifica se o sql está correto
        expect(db.query.mock.calls[0][0]).toContain('AND upper(prod_no_produto) like');
        expect(db.query.mock.calls[0][0]).toContain('AND prod_vl_preco >=');
        expect(db.query.mock.calls[0][0]).toContain('AND prod_vl_preco <=');
        expect(db.query.mock.calls[0][0]).toContain('AND prod_dt_cadastro >=');
        expect(db.query.mock.calls[0][0]).toContain('AND prod_dt_cadastro <=');
        expect(db.query.mock.calls[0][0]).toContain('AND prod_in_status =');

        // Verifica chamada do getFirebaseImage
        expect(firebase.getFirebaseImage).toHaveBeenCalledWith('1');

        // Verifica os resultados das chamadas
        expect(result[0].prod_path_url_thumbnail).toEqual('2');
        expect(result[0].show_iframe).toBe(false);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getProdutos('Product1', 100, 500, '2021-01-01', '2021-12-31', 'A', 0, 10))
            .rejects.toThrow('Error'); // pega o reject dentro da promisse fazer um const para aguardar o reultado nao resolve
    });
});

describe('getProduto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch a product with the correct SQL query and parameters', async () => {
        const mockData = {
            rows: [
                {
                    prod_co_produto: 1,
                    prod_no_produto: 'teste',
                    prod_vl_preco: 100,
                    prod_url_3d: 'teste',
                    prod_tx_descricao: 'Descrição do produto'
                }
            ]
        };

        db.query.mockResolvedValue(mockData);

        const result = await repository.getProduto(1);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('SELECT prod_co_produto, prod_no_produto, prod_vl_preco, prod_url_3d, prod_tx_descricao FROM sys_produto WHERE prod_co_produto = $1');
        expect(db.query.mock.calls[0][1]).toEqual([1]);
        expect(result).toEqual(mockData.rows);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getProduto(1))
            .rejects.toThrow('Error');
    });
});
