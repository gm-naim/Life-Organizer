const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getUsers: () => ipcRenderer.invoke("get-users"),
    saveUser: user => ipcRenderer.invoke("save-user", user),
    getUser: email => ipcRenderer.invoke("get-user", email),
    updateUser: (oldEmail, user) =>
        ipcRenderer.invoke("update-user", oldEmail, user),

    getData: () => ipcRenderer.invoke("get-data"),
    saveData: data => ipcRenderer.invoke("save-data", data),

    addItem: (type, item) => ipcRenderer.invoke("add-item", type, item),
    updateItem: (type, id, item) =>
        ipcRenderer.invoke("update-item", type, id, item),
    deleteItem: (type, id) =>
        ipcRenderer.invoke("delete-item", type, id),

    restoreTrash: id => ipcRenderer.invoke("restore-trash", id),
    deleteTrash: id => ipcRenderer.invoke("delete-trash", id)
});