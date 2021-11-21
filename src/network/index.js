import { request } from "./request";

export function getLogin(loginForm) {
    return request({
        method: 'post',
        url: 'login',
        params: {
            username: loginForm.username,
            password: loginForm.password
        }
    })
}