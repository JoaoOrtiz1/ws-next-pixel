const bucket = require('../../../config/firebase/firebase');

exports.getFirebaseImage = async (productFolder) => {
    try {
        const [files] = await bucket.getFiles({ prefix: productFolder});
        const filePromises = files
            .filter(file => file.name.split('/')[1] !== '')
            .map(file => {
                const options = {
                    action: 'read',
                    expires: Date.now() + 55 * 60 * 1000,  // 55 minutos a partir de agora
                };
                return file.getSignedUrl(options);
            });

        const [url] = await Promise.all(filePromises);
        return url[0];
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return null;
    }
}
