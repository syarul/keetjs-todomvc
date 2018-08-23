/* global localStorage */
const store = (namespace, data) => {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data))
  }
  let store = localStorage.getItem(namespace)
  return (store && JSON.parse(store)) || []
}

const camelCase = s => s.charAt(0).toUpperCase() + s.slice(1)

export {
  store,
  camelCase
}
