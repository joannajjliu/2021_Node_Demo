// The model represents the database model for its component.

const startT = new Date(); //ISO date
const endT = new Date(Date.parse(startT.toString()) + 3.6 * Math.pow(10, 6)); //Sets end time to 1hr after start time

interface IAppointment {
  appointmentId: string,
  doctorId: string,
  doctorName: string,
  patientName: string,
  startTime: Date,
  endTime: Date
}
class Appointment {
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  startTime: Date;
  endTime: Date;

  constructor(
    appointmentId: string,
    doctorId: string,
    doctorName: string,
    patientName: string,
    startTime: Date = startT,
    endTime: Date = endT
  ) {
    this.appointmentId = appointmentId;
    this.doctorId = doctorId;
    this.doctorName = doctorName;
    this.patientName = patientName;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

export default Appointment;
export { IAppointment };