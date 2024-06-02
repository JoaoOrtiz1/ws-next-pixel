const handleUserInvalid = async (res) => {
    try {
        res.status(401).json({
            message: 'Usuário não autorizado'
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            message: error.message
        });
    }
}
exports.checkUser = (req, res, id) => {
    try {
        if ((req.auth.sub.split('|')[1]).replace(/[^\d]/g, '') == id) {
            return true;
        }
        handleUserInvalid(res);
        return false;
    } catch (error) {
        res.status(500).send({
            error: error,
            message: error.message
        });
        return false;
    }
}
