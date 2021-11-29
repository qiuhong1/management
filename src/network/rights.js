import { request } from "./request";

export function getRightsList() {
    return request({
        url: 'rights/list'
    })
}

// 获取角色列表
export function getRolesList() {
    return request({
        url: 'roles',
    })
}
// 添加角色
export function addRoles(addRoleForm) {
    return request({
        url: 'roles',
        method: 'post',
        data: {
            roleName: addRoleForm.roleName,
            roleDesc: addRoleForm.roleDesc
        }
    })
}

// 根据id获取角色
export function getRoleById(id) {
    return request({
        url: 'roles/' + id,
    })
}

// 提交编辑角色
export function editRoles(idForm) {
    return request({
        url: 'roles/' + idForm.roleId,
        method: 'put',
        data: {
            roleName: idForm.roleName,
            roleDesc: idForm.roleDesc
        }
    })
}
// 删除角色
export function deleteRole(id) {
    return request({
        url: 'roles/' + id,
        method: 'delete'
    })
}

// 删除角色指定权限
export function deleteRoleRright(roleid, rightid) {
    return request({
        url: 'roles/' + roleid + '/rights/' + rightid,
        method: 'delete'
    })
}

// 角色权限分配
export function setRoleRights(id, idStr) {
    return request({
        url: 'roles/' + id + '/rights',
        method: 'post',
        data: {
            rids: idStr
        }
    })
}