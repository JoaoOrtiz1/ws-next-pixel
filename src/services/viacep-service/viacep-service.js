const axios = require('axios');


exports.getEnderecoPorCep = async (cep) => {
    try {
      const url = `https://viacep.com.br/ws/${cep}/json/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
}

