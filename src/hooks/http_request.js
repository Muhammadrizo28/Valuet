import axios from "axios";


function Http_request() {

    async function request(method = 'get', path, body ) {

        try {

            let res = await axios[method](`http://localhost:8080${path}`, body)

            if(res.status >= 200 && res.status < 300) {

                return res
            }
            else {
                console.log('Errror'); 
            }
            

        }
        catch(error){

            console.log(error);
        }
        
    }

    return request
   
}

export default Http_request;