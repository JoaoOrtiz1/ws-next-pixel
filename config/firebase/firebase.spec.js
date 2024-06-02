const mockBucket = jest.fn();
const mockStorageInstance = {
    bucket: mockBucket
};
const mockStorage = jest.fn(() => mockStorageInstance);

jest.mock('@google-cloud/storage', () => ({
    Storage: mockStorage
}));

const { Storage } = require('@google-cloud/storage');
require('./firebase');  

describe('Storage bucket initialization', () => {
    it('should create a bucket with the correct parameters', () => {
        expect(Storage).toHaveBeenCalledTimes(1);
        expect(Storage).toHaveBeenCalledWith({ keyFilename: 'next-pixel-firebase-admin.json' });
        
        expect(mockBucket).toHaveBeenCalledTimes(1);
        expect(mockBucket).toHaveBeenCalledWith('next-pixel.appspot.com');
    });
});
