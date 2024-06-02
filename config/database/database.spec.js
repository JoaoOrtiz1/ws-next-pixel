// No seu módulo de teste
const { Pool } = require('pg');
jest.mock('pg', () => {
    const mPool = {
      query: jest.fn().mockResolvedValue({ rows: [{ id: 1, name: 'Test' }] }),
      on: jest.fn(),
      connect: jest.fn()
    };
    return { Pool: jest.fn(() => mPool) };
});

const db = require('./database');
const pool = new Pool();

describe('Database operations', () => {
    it('should fetch data using query', async () => {
        const mockQuery = jest.fn().mockResolvedValue({ rows: [{ id: 1, name: 'Test' }] });
        pool.query = mockQuery;  // Diretamente mocar o método `query` do pool criado.

        const data = await db.query('SELECT * FROM users'); // db.query tem 2 props, text e values, caso n passado ficam undefined
        expect(data.rows).toEqual([{ id: 1, name: 'Test' }]);
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users', undefined);
    });
});
