module.exports = {
    sucess: (object, property, msg) => {
        let response = {
            status: true, 
            resp: msg
        };

        if(property)
            response[property] = object;
        else
            response.data = object;
        return response;
        
    },
    fail: (message, error) => {
        return {
            status: false, 
            message: message,
            error: error
        };
    }
}