const store = (namespace, data) => {
  if (arguments.length > 1) {
    return window.localStorage.setItem(namespace, JSON.stringify(data))
  } else {
    let store = window.localStorage.getItem(namespace)
    return store ? JSON.parse(store) : []
  }
}

const camelCase = s => s.charAt(0).toUpperCase() + s.slice(1)

export {
  store,
  camelCase
}
