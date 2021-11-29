class Patient {
    constructor(id, username, password, email, fullname, iCPassprt){
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullname = fullname;
        this.iCPassprt = iCPassprt;
    }
}

module.exports = Patient;