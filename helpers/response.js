module.exports = {
    sucess: (object, property, msg, page, limit, count_rows) => {
        let response = {
            status: true, 
            resp: msg
        };
        
        if(page) response['page'] = page; 
        if(limit) response['limit'] = limit;
        if(count_rows) response['count_rows'] = count_rows;

        if(property)
            response[property] = object;
        else
            response.data = object;
        return response;
        
    },
    fail: (message, error) => {
        if (error) return { status: false, msg: message, error: error};
        else return { status: false, message: message };
    }
}