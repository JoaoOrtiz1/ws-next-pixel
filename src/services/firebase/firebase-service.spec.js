const bucket = require('../../../config/firebase/firebase');
const firebase = require('./firebase-service');

jest.mock('../../../config/firebase/firebase');

describe('getFirebaseImage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should get product image from firebase passing path folder', async () => {
        const expectUrl = 'urlretornada';
        const mockData = [
            {name: '1/teste.jpg', getSignedUrl: jest.fn().mockResolvedValue([expectUrl])}
        ]
        bucket.getFiles.mockResolvedValue([mockData]);

        const result = await firebase.getFirebaseImage('1');

        expect(bucket.getFiles).toHaveBeenCalled();
        expect(bucket.getFiles).toHaveBeenCalledWith({ prefix: '1' }); // garante q foi chamado com o folder
        expect(mockData[0].getSignedUrl).toHaveBeenCalledWith({
            action: 'read',
            expires: expect.any(Number)  // Usar expect.any(Number) para valores dinâmicos
        });
        expect(result).toEqual(expectUrl);
    }) 

    it('should handle errors and return null if generating signed URL fails', async () => {
        bucket.getFiles.mockResolvedValue([[]]);  // Simular que não achou arquivos
        const result = await firebase.getFirebaseImage('1');
        expect(result).toBeNull();
    });

    it('should return null if there are no files', async () => {
        bucket.getFiles.mockRejectedValue(new Error('Error accessing Firebase bucket'));
        const result = await firebase.getFirebaseImage('1');
        expect(result).toBeNull();
    });
})