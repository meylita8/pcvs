class Vaccination {
    constructor(vaccinationId, appointmentDate, status, remark, patientId, batchId) {
        this.vaccinationId = vaccinationId;
        this.appointmentDate = appointmentDate;
        this.status = status;
        this.remark = remark;
        this.patientId = patientId;
        this.batchId = batchId;
    }
}

module.exports = Vaccination;