class Batch {
    constructor(id, batchNo, expiryDate, quantityAvailable, quantityAdministered, healtCareCenterId, vaccineId) {
        this.id = id;
        this.batchNo = batchNo;
        this.expiryDate = expiryDate;
        this.quantityAvailable = quantityAvailable;
        this.quantityAdministered = quantityAdministered;
        this.healtCareCenterId = healtCareCenterId;
        this.vaccineId = vaccineId;
    }
}

module.exports = Batch;