import axios from "axios";
import Http_request from "./http_request";

function http_change(key, item2) {

    function set_data(userData) {
       
        const updatedData = {

            ...userData,
            [key] : item2
        }
      
        return updatedData; 
    }

    async function getting_data(id) {
        try {
            const res = await Http_request()('get', `/users/${id}`);

            if (res.status >= 200 && res.status < 300) {

                const updatedData = set_data(res.data); 

                const result = await put_request(id, updatedData); 

                if(result.status >= 200 && res.status < 300) {

                    return {status : result.status}
                }
                else {console.log('error of get_put_Data')}

            } else {console.log('Ошибка: статус ответа', res.status); return { status: res.status } }

        } catch (err) {

            console.log('Error of getting data', err);
            return { status: 500, error: err }
        }
    }


    async function put_request(id, body) {

        try {

            const res = await axios.put(`http://localhost:8080/users/${id}`, body)
    
            if(res.status >= 200 && res.status < 300) {
    
                return {status : res.status}
    
            }
            else {console.log('error of put_request')}

        }
        catch(err) {console.log(err)}


    }

    return getting_data;

}

export default http_change;