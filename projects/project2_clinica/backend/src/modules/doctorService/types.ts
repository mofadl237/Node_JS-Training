export interface ICreateDoctorServiceInput {
  doctorId?: string;
  clinicServiceId: string;
  price: number | string;
  durationMinutes: number;
  isActive?: boolean;
}

export interface IUpdateDoctorServiceInput {
  price?: number | string;
  durationMinutes?: number;
  isActive?: boolean;
}

export interface IDoctorServiceResponse {
  id: string;
  doctorId: string;
  clinicServiceId: string;
  price: any;
  durationMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  doctor?: any;
  clinicService?: any;
}
