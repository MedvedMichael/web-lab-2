
const Url = require('url-parse')
const parseQuery = (query) => {
    const queryStrings = query.slice(1).split('&')
    const queryItems = {}
    queryStrings.forEach(item => {
        const parts = item.split('=')
        queryItems[parts[0]] = parts[1]
    })
    return queryItems
}

const pushToURL = (name, key, value) => window.history.replaceState(null, null, `${name}?${key}=${value}`)

const saveToLocalStorage = (name, value, defaultValue = []) => localStorage.setItem(name, value ? JSON.stringify(value) : JSON.stringify(defaultValue))

const getDataFromLocalStorage = (name, defaultValue = []) => {
    const res = localStorage.getItem(name)
    return res ? JSON.parse(res) : defaultValue
}

const generateID = (ids) => {
    const output = Math.random().toString(36).slice(0,5)
    if(ids.find(id => output === id))
        return generateID(ids)
    return output
}

export { generateID, parseQuery, pushToURL, saveToLocalStorage, getDataFromLocalStorage }