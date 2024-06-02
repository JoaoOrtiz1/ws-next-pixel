const repository = require('./nxt-usuario-repository');
const db = require('../../../config/database/database');
const firebase = require('../../services/firebase/firebase-service');
const auth0 = require('../../services/auth0/auth0-service');

jest.mock('../../../config/database/database');
jest.mock('../../services/firebase/firebase-service');
jest.mock('../../services/auth0/auth0-service');

describe('getUsuario', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch a user with the correct SQL query and parameters', async () => {
        const mockData = {
            rows: [
                {
                    usu_co_usuario: 1,
                    usu_no_usuario: 'John Doe',
                    usu_no_email: 'john.doe@example.com',
                    usu_in_status: 'A'
                }
            ]
        };

        db.query.mockResolvedValue(mockData);
        firebase.getFirebaseImage.mockResolvedValue('url-to-image');

        const result = await repository.getUsuario('user|123');

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('SELECT usu_co_usuario, usu_no_usuario, usu_no_email, usu_in_status FROM sys_usuario WHERE usu_co_usuario = $1');
        expect(db.query.mock.calls[0][1]).toEqual(['123']);
        expect(firebase.getFirebaseImage).toHaveBeenCalledWith(1);
        expect(result[0].usu_ft_url).toEqual('url-to-image');
        expect(result).toEqual(mockData.rows);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.getUsuario('user|123'))
            .rejects.toThrow('Error');
    });
});

describe('postUsuario', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should insert a user with the correct SQL query and parameters', async () => {
        const mockData = { rowCount: 1 };

        db.query.mockResolvedValue(mockData);

        const result = await repository.postUsuario('user|123', 'John Doe', 'john.doe@example.com');

        expect(db.query).toHaveBeenCalled();
        const query = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(query).toContain('INSERT INTO sys_usuario( usu_co_usuario, usu_no_usuario, usu_no_email, usu_in_status ) VALUES( $1, $2, $3, \'A\' )');
        expect(db.query.mock.calls[0][1]).toEqual(['123', 'John Doe', 'john.doe@example.com']);
        expect(result).toEqual(mockData);
    });

    it('should handle and throw database errors', async () => {
        db.query.mockRejectedValue(new Error('Error'));

        await expect(repository.postUsuario('user|123', 'John Doe', 'john.doe@example.com'))
            .rejects.toThrow('Error');
    });
});

describe('putUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update a user with the correct SQL query and parameters', async () => {
        const mockData = { rowCount: 1 };

        db.query.mockResolvedValueOnce({ rowCount: 1 }); // for begin
        db.query.mockResolvedValueOnce(mockData); // for update
        db.query.mockResolvedValueOnce({ rowCount: 1 }); // for commit
        auth0.updateUser.mockResolvedValue({});

        const result = await repository.putUser('123', 'John Doe', 'john.doe@example.com', 'A', 'user|123');

        expect(db.query).toHaveBeenCalledTimes(3);
        const beginQuery = db.query.mock.calls[0][0].replace(/\s+/g, ' ').trim();
        expect(beginQuery).toContain('begin');
        const updateQuery = db.query.mock.calls[1][0].replace(/\s+/g, ' ').trim();
        expect(updateQuery).toContain('UPDATE sys_usuario SET usu_no_usuario = $1, usu_no_email = $2, usu_in_status = $3 WHERE usu_co_usuario = $4');
        expect(db.query.mock.calls[1][1]).toEqual(['John Doe', 'john.doe@example.com', 'A', '123']);
        const commitQuery = db.query.mock.calls[2][0].replace(/\s+/g, ' ').trim();
        expect(commitQuery).toContain('commit');
        expect(auth0.updateUser).toHaveBeenCalledWith({ usu_no_usuario: 'John Doe', usu_no_email: 'john.doe@example.com', usu_in_status: 'A', sub: 'user|123' });
        expect(result).toEqual(mockData);
    });

    it('should handle and throw database errors, and rollback', async () => {
        db.query.mockResolvedValueOnce({ rowCount: 1 }); // for begin
        db.query.mockRejectedValueOnce(new Error('Error')); // for update
        db.query.mockResolvedValueOnce({ rowCount: 1 }); // for rollback

        await expect(repository.putUser('123', 'John Doe', 'john.doe@example.com', 'A', 'user|123'))
            .rejects.toThrow('Error');

        expect(db.query).toHaveBeenCalledTimes(3);
        const rollbackQuery = db.query.mock.calls[2][0].replace(/\s+/g, ' ').trim();
        expect(rollbackQuery).toContain('rollback');
    });
});
