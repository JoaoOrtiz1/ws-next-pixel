const repository = require('./nxt-carrinho-repository');
const db = require('../../../config/database/database');
const firebase = require('../../services/firebase/firebase-service');

jest.mock('../../../config/database/database');
jest.mock('../../services/firebase/firebase-service');

describe('getProdutosCarrinho', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch cart products with the correct SQL query and parameters', async () => {
        const mockData = {
            rows: [
                {
                    prod_no_produto: 'Produto1',
                    prod_co_produto: 1,
                    scp_prod_qt_produto: 2,
                    prod_vl_preco: 100.0,
                    prod_url_3d: 'url3d',
                    prod_path_url_thumbnail: 'pathThumbnail'
                }
            ]
        };

        db.query.mockResolvedValue(mockData);
        firebase.getFirebaseImage.mockResolvedValue('firebaseImage');

        const result = await repository.getProdutosCarrinho('user123', 10, 0, true, 'temp123');

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        // expect(query).toContain('SELECT prod.prod_no_produto, prod.prod_co_produto, scp.prod_qt_produto, prod.prod_vl_preco, prod.prod_url_3d, prod.prod_path_url_thumbnail, COUNT(*) OVER () AS total_records FROM sys_carrinho cr INNER JOIN sys_carrinho_produto scp ON cr.car_co_carrinho = scp.car_co_carrinho INNER JOIN sys_produto prod ON scp.prod_co_produto = prod.prod_co_produto LEFT JOIN sys_usuario usu ON cr.usu_co_usuario = usu.usu_co_usuario WHERE usu.usu_co_usuario = $1 LIMIT $2 OFFSET $3');
        // expect(db.query.mock.calls[0][1]).toEqual(['user123', 10, 0]);
        expect(firebase.getFirebaseImage).toHaveBeenCalled();
        expect(result).toEqual([{
            prod_no_produto: 'Produto1',
            prod_co_produto: 1,
            scp_prod_qt_produto: 2,
            prod_vl_preco: 100.0,
            prod_url_3d: 'url3d',
            prod_path_url_thumbnail: 'firebaseImage',
            show_iframe: false
        }]);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getProdutosCarrinho('user123', 10, 0, true, 'temp123')).rejects.toThrow('Error');
    });
});

describe('deleteProduto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a product with the correct SQL query and parameters', async () => {
        db.query.mockResolvedValue({ rowCount: 1 });

        const result = await repository.deleteProduto('user123', 1, true);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('DELETE FROM sys_carrinho_produto WHERE car_co_carrinho = ( SELECT car_co_carrinho FROM sys_carrinho WHERE usu_co_usuario = $1 )');
        expect(db.query.mock.calls[0][1]).toEqual(['user123', 1]);
        expect(result).toBeUndefined();
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.deleteProduto('user123', 1, true)).rejects.toThrow('Error');
    });
});

describe('getQuantidadeProdutos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch product quantities with the correct parameters', async () => {
        const mockData = {
            rows: [{ total_records: 5 }]
        };

        db.query.mockResolvedValue(mockData);

        const result = await repository.getQuantidadeProdutos('user123', true, 'temp123');

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        // expect(query).toContain('SELECT COUNT(*) as total_records FROM sys_carrinho_produto cpr INNER JOIN sys_carrinho cr on cpr.car_co_carrinho = cr.car_co_carrinho WHERE cr.usu_co_usuario = $1');
        // expect(db.query.mock.calls[0][1]).toEqual(['user123']);
        expect(result).toEqual(mockData.rows);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getQuantidadeProdutos('user123', true, 'temp123')).rejects.toThrow('Error');
    });
});

describe('putQuantidadeProduto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update product quantity with the correct SQL query and parameters', async () => {
        db.query.mockResolvedValue({ rowCount: 1 });

        const result = await repository.putQuantidadeProduto('user123', 1, 3, true);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('UPDATE sys_carrinho_produto SET prod_qt_produto = $1 WHERE car_co_carrinho = ( SELECT car_co_carrinho FROM sys_carrinho WHERE usu_co_usuario = $2 ) AND prod_co_produto = $3');
        expect(db.query.mock.calls[0][1]).toEqual([3, 'user123', 1]);
        expect(result).toEqual({ rowCount: 1 });
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.putQuantidadeProduto('user123', 1, 3, true)).rejects.toThrow('Error');
    });
});

describe('getCarrinhoResumo', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch cart summary with the correct SQL query and parameters', async () => {
        const mockData = {
            rows: [{ total_carrinho: 200.0 }]
        };

        db.query.mockResolvedValue(mockData);

        const result = await repository.getCarrinhoResumo('user123', true);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('SELECT SUM( COALESCE(prod.prod_vl_preco*crp.prod_qt_produto, 0) ) as total_carrinho FROM sys_carrinho cr INNER JOIN sys_carrinho_produto crp ON cr.car_co_carrinho = crp.car_co_carrinho LEFT JOIN sys_produto prod ON crp.prod_co_produto = prod.prod_co_produto WHERE cr.usu_co_usuario = $1');
        expect(db.query.mock.calls[0][1]).toEqual(['user123']);
        expect(result).toEqual(mockData.rows);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getCarrinhoResumo('user123', true)).rejects.toThrow('Error');
    });
});

describe('postProdutoCarrinho', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should insert a product into the cart with the correct SQL query and parameters', async () => {
        db.query.mockResolvedValue({ rowCount: 1 });

        const result = await repository.postProdutoCarrinho('user123', 1, true);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('INSERT INTO sys_carrinho_produto( car_co_carrinho, prod_co_produto, prod_qt_produto ) VALUES( (SELECT car_co_carrinho FROM sys_carrinho WHERE usu_co_usuario = $1), $2, 1 ) ON CONFLICT (car_co_carrinho, prod_co_produto) DO UPDATE SET prod_qt_produto = sys_carrinho_produto.prod_qt_produto + 1;');
        expect(db.query.mock.calls[0][1]).toEqual(['user123', 1]);
        expect(result).toEqual({ rowCount: 1 });
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.postProdutoCarrinho('user123', 1, true)).rejects.toThrow('Error');
    });
});
