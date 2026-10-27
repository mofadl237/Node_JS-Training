export interface ICreateDoctorAvailabilityInput {
  doctorId: string;
  startsAt: string | Date;
  endsAt: string | Date;
  isActive?: boolean;
}

export interface IUpdateDoctorAvailabilityInput {
  startsAt?: string | Date;
  endsAt?: string | Date;
  isActive?: boolean;
}

export interface IDoctorAvailabilityResponse {
  id: string;
  doctorId: string;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
