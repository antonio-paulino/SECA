
export class Group {
    constructor(name, description, userID, id) {
        this.id = id || null
        this.userID = userID || null
        this.name = name;
        this.description = description;
        this.events = [];
    }
}

export class User {
    constructor(username, token, id, password) {
        this.name = username
        this.password = password 
        this.token = token || null
        this.id = id || null
    }
}