export interface ICreateAppointmentInput {
  doctorServiceId: string;
  startsAt: string | Date;
  notes?: string;
}

export interface IAppointmentResponse {
  id: string;
  patientId: string;
  doctorId: string;
  doctorServiceId: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
  priceAtBooking: any;
  durationMinutesAtBooking: number;
  serviceNameSnapshot: string | null;
  doctorDisplayNameSnapshot: string | null;
  notes: string | null;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}
