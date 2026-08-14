const {
    contextBridge,
    ipcRenderer
} = require("electron");


contextBridge.exposeInMainWorld(
    "electronAPI",
    {

        getUsers: () =>
            ipcRenderer.invoke(
                "get-users"
            ),


        createUser: (user) =>
            ipcRenderer.invoke(
                "create-user",
                user
            ),


        updateUser: (
            email,
            user
        ) =>
            ipcRenderer.invoke(
                "update-user",
                email,
                user
            ),


        saveUserData: (
            email,
            field,
            value
        ) =>
            ipcRenderer.invoke(
                "save-user-data",
                email,
                field,
                value
            ),


        getUser: (email) =>
            ipcRenderer.invoke(
                "get-user",
                email
            ),


        deleteUser: (email) =>
            ipcRenderer.invoke(
                "delete-user",
                email
            )

    }
);