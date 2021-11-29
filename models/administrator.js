class Administrator {
    constructor(id, username, password, email, fullname, staffID, healtCareCenterId) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullname = fullname;
        this.staffID = staffID;
        this.healtCareCenterId = healtCareCenterId;
    }
}

module.exports = Administrator;