
export const apiUrl = "http://192.168.1.2:5001/"//remember to always set ipv4 to this address of backend

export const apiUpload = apiUrl + "uploaded"

export const NOT_CONNECT_NETWORK = 'NOT_CONNECT_NETWORK' 
export const NETWORK_CONNECTION_MESSAGE = 'Cannot connect to server, Please try again.'

export const key = {
    LOGIN_PASSED: `LOGIN_PASSED`,
    API_KEY: `API_KEY`,
    USER_LV: `USER_LV`,
    USER_NAME: "USER_NAME",
    USER_EMP: "USER_EMP",
};

export const lastLoginPage = {
    LOGIN_PAGE: ``,
}

export const server = {
    LOGIN_URL: `api/authen/login`,
    URL_REGIST: `api/authen/register`,
    LOGIN_PASSED: `yes`,
}
export const YES = 'YES'

const mqttWebSocketPort = "1885"
export const mqttURL = "mqtt://192.168.1.2:" + mqttWebSocketPort