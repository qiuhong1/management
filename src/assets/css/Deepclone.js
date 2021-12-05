export function Deepclone(newobj, obj) {
    for (var k in obj) {
        var item = obj[k]
        if (item instanceof Array) {
            newobj[k] = []
            Deepclone(newobj[k], item)
        } else if (item instanceof Object) {
            newobj[k] = {}
            Deepclone(newobj[k], item)
        } else {
            newobj[k] = item
        }
    }
    return newobj
}