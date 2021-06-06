let onlineUsers = []

function getUsersByRoom(room){
    return onlineUsers.filter(user=>user.room === room)
}

function getUsers(){
    return onlineUsers
}

function getUsersWithoutMe(id){
    return onlineUsers.filter(user=>user.id !== id)
}

function userConnected(user){
    if(user){
        onlineUsers.push(user)
        return user
    }
}

function changeRoom(id, room, roomName){
    const newUsers = onlineUsers.map(user=>{
        if(user.id === id){
            return {...user, room, roomName}
        }
        return user
    })
    onlineUsers = newUsers
}

function checkIfAlreadyOnline(id){
    if(!onlineUsers) return false

    if(onlineUsers.filter(user=>id === user.id).length){
        return true
    }
    return false
}

function userDisconnected(id){
    if(onlineUsers){
        onlineUsers = onlineUsers.filter(user=>user.id!==id)
    }
}

module.exports = {getUsers, getUsersByRoom, userConnected, userDisconnected, changeRoom, checkIfAlreadyOnline, getUsersWithoutMe}
