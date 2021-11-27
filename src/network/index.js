import { request } from "./request";

// 请求登录
export function getLogin(loginForm) {
    return request({
        method: 'post',
        url: 'login',
        data: {
            username: loginForm.username,
            password: loginForm.password
        }
    })
}


// 请求左侧菜单
export function getLeftMenu() {
    return request({
        url: 'menus',
    })
}

// 获取用户列表数据
export function getUserList(queryInfo) {
    return request({
        url: 'users',
        params: queryInfo
    })
}

// 更改用户的状态
export function userStateChange(userInfo) {
    return request({
        url: 'users/' + userInfo.id + '/state/' + userInfo.mg_state,
        // 模板字符串拼接
        // url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
        method: 'put'
    })
}

//添加用户
export function addUsers(addForm) {
    return request({
        url: 'users',
        method: 'post',
        data: addForm
    })
}

// 根据id查询数据
export function queryID(id) {
    return request({
        url: 'users/' + id,
    })
}

// 修改用户信息
// export function editUser(editForm) {
//     return request({
//         url: 'users/' + editForm.id,
//         method: 'put',
//         params: {
//             email: editForm.email,
//             mobile: editForm.mobile
//         }
//     })
// }