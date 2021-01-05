
interface ISchedule {
  Monday: string,
  Tuesday: string,
  Wednesday: string,
  Thursday: string,
  Friday: string,
  Saturday: string,
  Sunday: string
}

interface IAvailability {
  doctorId: string,
  doctorName: string,
  schedule: ISchedule
}

interface IAvailabilities {
  availabilities: IAvailability[];
}

class Availability {
  doctorId: string;
  doctorName: string;
  schedule: ISchedule;

  constructor(
    doctorId: string,
    doctorName: string,
    schedule: ISchedule
  ) {
    this.doctorId = doctorId;
    this.doctorName = doctorName;
    this.schedule = schedule;
  }
}

export default Availability;
export { IAvailability, IAvailabilities, ISchedule };