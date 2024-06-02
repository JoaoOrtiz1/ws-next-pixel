var ManagementClient = require('auth0').ManagementClient;
require("dotenv").config();

const auth0 = new ManagementClient({
    domain: process.env.DOMAIN,
    clientId: process.env.CLIENTIDM,
    clientSecret: process.env.CLIENTSECRET, // secret do M2M
    audience: process.env.AUDIENCEM // para fazer o management precisa da audience da api management, para o app e decode do token crie outra api
})

exports.updateUser = async (user) => {
    try {
        let data = {
            name: user.usu_no_usuario,
            "blocked": user.usu_in_status == 'I'? true: false
        }
        if(user.sub.split('|')[0] !== 'google-oauth2'){
            data = {   
                email: user.usu_no_email,
            }
        }
        const params = {
            id: user.sub
        }
        const update = await auth0.users.update(params, data);
        
    } catch (error) {
        throw error
    }
}
