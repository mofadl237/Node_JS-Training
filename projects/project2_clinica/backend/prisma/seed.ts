import "dotenv/config";
import { AppointmentStatus, UserRole } from "@prisma/client";
import { prisma } from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/password.js";

const seedPassword = process.env.SEED_PASSWORD ?? "Password123";

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.doctorAvailability.deleteMany();
  await prisma.doctorService.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinicService.deleteMany();
  await prisma.specialization.deleteMany();

  const password = await hashPassword(seedPassword);

  const s1 = await prisma.specialization.create({ data: { name: "Internal Medicine", slug: "internal-medicine", isActive: true } });
  const s2 = await prisma.specialization.create({ data: { name: "Cardiology", slug: "cardiology", isActive: true } });
  const s3 = await prisma.specialization.create({ data: { name: "Dermatology", slug: "dermatology", isActive: true } });
  const s4 = await prisma.specialization.create({ data: { name: "Pediatrics", slug: "pediatrics", isActive: true } });
  const s5 = await prisma.specialization.create({ data: { name: "Orthopedics", slug: "orthopedics", isActive: true } });

  const c1 = await prisma.clinicService.create({ data: { name: "General Consultation", slug: "general-consultation", isActive: true } });
  const c2 = await prisma.clinicService.create({ data: { name: "Follow Up", slug: "follow-up", isActive: true } });
  const c3 = await prisma.clinicService.create({ data: { name: "Medical Checkup", slug: "medical-checkup", isActive: true } });

  await prisma.user.create({ data: { name: "Clinic Admin", email: "admin@clinica.com", password, role: UserRole.ADMIN } });
  const p1 = await prisma.user.create({ data: { name: "Ahmed Mohamed", email: "ahmed.mohamed@example.com", password, role: UserRole.PATIENT } });
  const p2 = await prisma.user.create({ data: { name: "Sara Hassan", email: "sara.hassan@example.com", password, role: UserRole.PATIENT } });
  await prisma.user.create({ data: { name: "Mohamed Ali", email: "mohamed.ali@example.com", password, role: UserRole.PATIENT } });

  const du1 = await prisma.user.create({ data: { name: "Dr. Karim Fouad", email: "karim.fouad@clinica.com", password, role: UserRole.DOCTOR } });
  const du2 = await prisma.user.create({ data: { name: "Dr. Nour El-Din", email: "nour.eldin@clinica.com", password, role: UserRole.DOCTOR } });
  const du3 = await prisma.user.create({ data: { name: "Dr. Yara Samir", email: "yara.samir@clinica.com", password, role: UserRole.DOCTOR } });
  const du4 = await prisma.user.create({ data: { name: "Dr. Hany Rashad", email: "hany.rashad@clinica.com", password, role: UserRole.DOCTOR } });

  const d1 = await prisma.doctor.create({ data: { userId: du1.id, specializationId: s2.id, bio: "Cardiologist" } });
  const d2 = await prisma.doctor.create({ data: { userId: du2.id, specializationId: s1.id, bio: "Internal Medicine" } });
  const d3 = await prisma.doctor.create({ data: { userId: du3.id, specializationId: s3.id, bio: "Dermatologist" } });
  const d4 = await prisma.doctor.create({ data: { userId: du4.id, specializationId: s5.id, bio: "Orthopedic" } });

  await prisma.doctorService.create({ data: { doctorId: d1.id, clinicServiceId: c1.id, price: "400.00", durationMinutes: 20, isActive: true } });
  await prisma.doctorService.create({ data: { doctorId: d1.id, clinicServiceId: c2.id, price: "250.00", durationMinutes: 15, isActive: true } });
  await prisma.doctorService.create({ data: { doctorId: d2.id, clinicServiceId: c1.id, price: "300.00", durationMinutes: 20, isActive: true } });
  await prisma.doctorService.create({ data: { doctorId: d2.id, clinicServiceId: c2.id, price: "200.00", durationMinutes: 10, isActive: true } });
  await prisma.doctorService.create({ data: { doctorId: d2.id, clinicServiceId: c3.id, price: "350.00", durationMinutes: 25, isActive: true } });
  await prisma.doctorService.create({ data: { doctorId: d3.id, clinicServiceId: c1.id, price: "450.00", durationMinutes: 25, isActive: true } });
  await prisma.doctorService.create({ data: { doctorId: d3.id, clinicServiceId: c2.id, price: "300.00", durationMinutes: 15, isActive: true } });
  await prisma.doctorService.create({ data: { doctorId: d4.id, clinicServiceId: c1.id, price: "500.00", durationMinutes: 30, isActive: true } });
  await prisma.doctorService.create({ data: { doctorId: d4.id, clinicServiceId: c2.id, price: "350.00", durationMinutes: 20, isActive: true } });

  const day = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  await prisma.doctorAvailability.create({ data: { doctorId: d1.id, startsAt: new Date(day.getTime() + 9 * 3600000), endsAt: new Date(day.getTime() + 12 * 3600000), isActive: true } });
  await prisma.doctorAvailability.create({ data: { doctorId: d1.id, startsAt: new Date(day.getTime() + 14 * 3600000), endsAt: new Date(day.getTime() + 17 * 3600000), isActive: true } });
  await prisma.doctorAvailability.create({ data: { doctorId: d2.id, startsAt: new Date(day.getTime() + 9 * 3600000), endsAt: new Date(day.getTime() + 13 * 3600000), isActive: true } });
  await prisma.doctorAvailability.create({ data: { doctorId: d2.id, startsAt: new Date(day.getTime() + 15 * 3600000), endsAt: new Date(day.getTime() + 18 * 3600000), isActive: true } });
  await prisma.doctorAvailability.create({ data: { doctorId: d3.id, startsAt: new Date(day.getTime() + 10 * 3600000), endsAt: new Date(day.getTime() + 14 * 3600000), isActive: true } });
  await prisma.doctorAvailability.create({ data: { doctorId: d4.id, startsAt: new Date(day.getTime() + 9 * 3600000), endsAt: new Date(day.getTime() + 12 * 3600000), isActive: true } });
  await prisma.doctorAvailability.create({ data: { doctorId: d4.id, startsAt: new Date(day.getTime() + 14 * 3600000), endsAt: new Date(day.getTime() + 16 * 3600000), isActive: true } });

  const ds1 = await prisma.doctorService.findFirst({ where: { doctorId: d1.id, clinicServiceId: c1.id } });
  if (ds1) {
    await prisma.appointment.create({
      data: {
        patientId: p1.id,
        doctorId: d1.id,
        doctorServiceId: ds1.id,
        startsAt: new Date(day.getTime() + 9.5 * 3600000),
        endsAt: new Date(day.getTime() + 9.5 * 3600000 + ds1.durationMinutes * 60000),
        status: AppointmentStatus.BOOKED,
        priceAtBooking: ds1.price,
        durationMinutesAtBooking: ds1.durationMinutes,
        serviceNameSnapshot: "General Consultation",
        doctorDisplayNameSnapshot: "Dr. Karim Fouad",
        notes: "Chest pain checkup",
      },
    });
  }

  const ds2 = await prisma.doctorService.findFirst({ where: { doctorId: d2.id, clinicServiceId: c2.id } });
  if (ds2) {
    await prisma.appointment.create({
      data: {
        patientId: p2.id,
        doctorId: d2.id,
        doctorServiceId: ds2.id,
        startsAt: new Date(day.getTime() + 15 * 3600000),
        endsAt: new Date(day.getTime() + 15 * 3600000 + ds2.durationMinutes * 60000),
        status: AppointmentStatus.COMPLETED,
        priceAtBooking: ds2.price,
        durationMinutesAtBooking: ds2.durationMinutes,
        serviceNameSnapshot: "Follow Up",
        doctorDisplayNameSnapshot: "Dr. Nour El-Din",
        notes: "Completed",
        reminderSent: true,
      },
    });
  }

  console.log(`Seed completed. Test accounts password: ${seedPassword}`);
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
