const repository = require('./nxt-endereco-repository');
const db = require('../../../config/database/database');
const viacep = require('../../services/viacep-service/viacep-service');

jest.mock('../../../config/database/database');
jest.mock('../../services/viacep-service/viacep-service');

describe('getEnderecosCarrinho', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch cart addresses with the correct SQL query and parameters', async () => {
        const mockData = {
            rows: [
                {
                    endc_co_endereco: 1,
                    endc_no_apelido: 'Casa',
                    usu_co_usuario: 'user123',
                    endc_co_cep: '12345-678',
                    endc_nu_numero: '100'
                }
            ]
        };

        db.query.mockResolvedValue(mockData);

        const result = await repository.getEnderecosCarrinho('user123', 'Casa');

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('SELECT endc_co_endereco, endc_no_apelido, usu_co_usuario, endc_co_cep, endc_nu_numero FROM sys_endereco WHERE usu_co_usuario = $1 and upper(endc_no_apelido) like upper($2)');
        expect(db.query.mock.calls[0][1]).toEqual(['user123', '%Casa%']);
        expect(result).toEqual(mockData.rows);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getEnderecosCarrinho('user123', 'Casa')).rejects.toThrow('Error');
    });
});

describe('getEndereco', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch a single address with the correct SQL query and parameters', async () => {
        const mockData = {
            rows: [
                {
                    usu_co_usuario: 'user123',
                    endc_co_endereco: 1,
                    endc_co_cep: '12345-678',
                    endc_co_estado: 'SP',
                    endc_nu_cidade: 'São Paulo',
                    endc_nu_numero: '100',
                    endc_no_apelido: 'Casa'
                }
            ]
        };

        db.query.mockResolvedValue(mockData);

        const result = await repository.getEndereco('user123', 1);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('SELECT usu_co_usuario, endc_co_endereco, endc_co_cep, endc_co_estado, endc_nu_cidade, endc_nu_numero, endc_no_apelido FROM sys_endereco WHERE usu_co_usuario = $1 and endc_co_endereco = $2');
        expect(db.query.mock.calls[0][1]).toEqual(['user123', 1]);
        expect(result).toEqual(mockData.rows);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getEndereco('user123', 1)).rejects.toThrow('Error');
    });
});

describe('getEnderecos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch addresses with the correct SQL query and parameters', async () => {
        const mockData = {
            rows: [
                {
                    endc_co_endereco: 1,
                    endc_co_cep: '12345-678',
                    endc_co_estado: 'SP',
                    endc_nu_cidade: 'São Paulo',
                    endc_nu_numero: '100',
                    endc_no_apelido: 'Casa',
                    endc_no_bairro: 'Centro',
                    endc_no_recebe: 'John Doe',
                    endc_no_rua: 'Rua Exemplo',
                    total_records: 1
                }
            ]
        };

        db.query.mockResolvedValue(mockData);

        const result = await repository.getEnderecos('user123', 0, 10);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('SELECT endc_co_endereco, endc_co_cep, endc_co_estado, endc_nu_cidade, endc_nu_numero, endc_no_apelido, endc_no_bairro, endc_no_recebe, endc_no_rua, count(*) over() as total_records FROM sys_endereco WHERE usu_co_usuario = $1 LIMIT $2 OFFSET $3');
        expect(db.query.mock.calls[0][1]).toEqual(['user123', 10, 0]);
        expect(result).toEqual(mockData.rows);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getEnderecos(1111, 0, 10)).rejects.toThrow('Error');
    });
});

describe('getEnderecosFull', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch full addresses with the correct parameters', async () => {
        const enderecos = [
            {
                endc_co_endereco: 1,
                endc_no_apelido: 'Casa',
                endc_co_cep: '12345-678',
                endc_nu_numero: '100',
                usu_co_usuario: 'user123'
            }
        ];

        const viacepData = {
            logradouro: 'Rua Exemplo',
            localidade: 'São Paulo',
            uf: 'SP'
        };

        viacep.getEnderecoPorCep.mockResolvedValue(viacepData);

        const result = await repository.getEnderecosFull(enderecos);

        expect(viacep.getEnderecoPorCep).toHaveBeenCalled();
        expect(result[0].optionLabel).toEqual('Casa: Rua Exemplo, São Paulo - SP, 100');
        expect(result[0].optionValue).toEqual('1|user123');
        expect(result[0].optionLabelSimple).toEqual('Casa');
    });

    it('should handle and throw errors when fetching full addresses', async () => {
        viacep.getEnderecoPorCep.mockRejectedValue(new Error('Error'));

        const enderecos = [
            {
                endc_co_endereco: 1,
                endc_no_apelido: 'Casa',
                endc_co_cep: '12345-678',
                endc_nu_numero: '100',
                usu_co_usuario: 'user123'
            }
        ];

        await expect(repository.getEnderecosFull(enderecos)).rejects.toThrow('Error');
    });
});

describe('deleteEndereco', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete an address with the correct SQL query and parameters', async () => {
        db.query.mockResolvedValue({ rowCount: 1 });

        const result = await repository.deleteEndereco('user123', 1);

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('DELETE FROM sys_endereco WHERE usu_co_usuario = $1 AND endc_co_endereco = $2');
        expect(db.query.mock.calls[0][1]).toEqual(['user123', 1]);
        expect(result).toBeUndefined();
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.deleteEndereco('user123', 1)).rejects.toThrow('Error');
    });
});

describe('postEndereco', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should insert an address with the correct SQL query and parameters', async () => {
        db.query.mockResolvedValue({ rowCount: 1 });

        const result = await repository.postEndereco('user123', '12345-678', 'SP', 'São Paulo', '100', 'Casa', 'Centro', 'John Doe', 'Rua Exemplo');

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('INSERT INTO sys_endereco ( endc_co_endereco, usu_co_usuario, endc_co_cep, endc_co_estado, endc_nu_cidade, endc_nu_numero, endc_no_apelido, endc_no_bairro, endc_no_recebe, endc_no_rua ) VALUES( (SELECT COALESCE(MAX(endc_co_endereco),0) from sys_endereco)+1, $1, $2, $3, $4, $5, $6, $7, $8, $9 ) ON CONFLICT DO NOTHING');
        expect(db.query.mock.calls[0][1]).toEqual(['user123', '12345-678', 'SP', 'São Paulo', '100', 'Casa', 'Centro', 'John Doe', 'Rua Exemplo']);
        expect(result).toEqual({ rowCount: 1 });
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.postEndereco('user123', '12345-678', 'SP', 'São Paulo', '100', 'Casa', 'Centro', 'John Doe', 'Rua Exemplo')).rejects.toThrow('Error');
    });
});

describe('putEndereco', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update an address with the correct SQL query and parameters', async () => {
        db.query.mockResolvedValue({ rowCount: 1 });

        const result = await repository.putEndereco(1, 'user123', '12345-678', 'SP', 'São Paulo', '100', 'Casa', 'Centro', 'John Doe', 'Rua Exemplo');

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('UPDATE sys_endereco SET endc_co_cep = $1, endc_co_estado = $2, endc_nu_cidade = $3, endc_nu_numero = $4, endc_no_apelido = $5, endc_no_bairro = $6, endc_no_recebe = $7, endc_no_rua = $8 WHERE usu_co_usuario = $9 and endc_co_endereco = $10');
        expect(db.query.mock.calls[0][1]).toEqual(['12345-678', 'SP', 'São Paulo', '100', 'Casa', 'Centro', 'John Doe', 'Rua Exemplo', 'user123', 1]);
        expect(result).toEqual({ rowCount: 1 });
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.putEndereco(1, 'user123', '12345-678', 'SP', 'São Paulo', '100', 'Casa', 'Centro', 'John Doe', 'Rua Exemplo')).rejects.toThrow('Error');
    });
});
