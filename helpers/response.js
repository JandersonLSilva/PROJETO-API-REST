module.exports = {
    sucess: (object, property, title, message) => {
        let response = {
            status: true, 
            title: title, 
            message: message
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