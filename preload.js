const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("electronAPI", {

    // Get all users
    getUsers: function() {

        return ipcRenderer.invoke("get-users");

    },


    // Save new user
    saveUser: function(user) {

        return ipcRenderer.invoke(
            "save-user",
            user
        );

    }

});