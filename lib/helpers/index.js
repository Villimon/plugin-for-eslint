// Проверка относительный ли путь
function isPathRelative(path) {
    return path === '.' || path.startsWith('./') || path.startsWith('../')
}

module.exports = {
    isPathRelative,
}
