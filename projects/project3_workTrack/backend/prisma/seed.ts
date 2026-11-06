import "dotenv/config";
import { hash } from "bcrypt";
import {
  EAttendanceSource,
  EAttendanceStatus,
  EAttendanceType,
  EEmployeeStatus,
  ERole,
  EUploadType,
} from "@prisma/client";
import { prisma } from "../src/config/prisma.js";

const seedPassword = process.env.SEED_PASSWORD ?? "Password123";

const startOfUtcDay = (offsetDays: number): Date => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date;
};

const atUtcTime = (date: Date, hours: number, minutes = 0): Date => {
  const value = new Date(date);
  value.setUTCHours(hours, minutes, 0, 0);
  return value;
};

async function main(): Promise<void> {
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceLog.deleteMany();
  await prisma.employeeShift.deleteMany();
  await prisma.uploadedFile.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash(seedPassword, 12);

  const admin = await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@worktrack.com",
      password,
      role: ERole.ADMIN,
    },
  });

  const hr = await prisma.user.create({
    data: {
      name: "Mona Ibrahim",
      email: "mona.hr@worktrack.com",
      password,
      role: ERole.HR,
    },
  });

  const hr2 = await prisma.user.create({
    data: {
      name: "Youssef Adel",
      email: "youssef.hr@worktrack.com",
      password,
      role: ERole.HR,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Omar Khaled",
      email: "omar.manager@worktrack.com",
      password,
      role: ERole.MANAGER,
    },
  });

  const engineering = await prisma.department.create({
    data: {
      name: "Engineering",
      description: "Product engineering and platform teams",
    },
  });

  const humanResources = await prisma.department.create({
    data: {
      name: "Human Resources",
      description: "People operations, hiring, and employee relations",
    },
  });

  const sales = await prisma.department.create({
    data: {
      name: "Sales",
      description: "Revenue and account management",
    },
  });

  const finance = await prisma.department.create({
    data: {
      name: "Finance",
      description: "Accounting, payroll, and financial planning",
    },
  });

  const operations = await prisma.department.create({
    data: {
      name: "Operations",
      description: "Facilities, logistics, and day-to-day operations",
    },
  });

  await prisma.user.update({
    where: { id: manager.id },
    data: { departmentId: engineering.id },
  });

  const morningShift = await prisma.shift.create({
    data: {
      name: "Morning Shift",
      startTime: "09:00",
      endTime: "17:00",
      graceMinutes: 15,
      expectedHours: 8,
      overtimeAfterMinutes: 30,
      isNightShift: false,
    },
  });

  const eveningShift = await prisma.shift.create({
    data: {
      name: "Evening Shift",
      startTime: "17:00",
      endTime: "01:00",
      graceMinutes: 10,
      expectedHours: 8,
      overtimeAfterMinutes: 45,
      isNightShift: true,
    },
  });

  const flexibleShift = await prisma.shift.create({
    data: {
      name: "Flexible Shift",
      startTime: "10:00",
      endTime: "18:00",
      graceMinutes: 20,
      expectedHours: 8,
      overtimeAfterMinutes: 0,
      isNightShift: false,
    },
  });

  const employeeInputs = [
    {
      employeeCode: "EMP-001",
      firstName: "Ahmed",
      lastName: "Mohamed",
      email: "ahmed.mohamed@worktrack.com",
      phone: "+201001234567",
      departmentId: engineering.id,
      jobTitle: "Backend Engineer",
      status: EEmployeeStatus.ACTIVE,
      hireDate: new Date("2023-03-01T00:00:00.000Z"),
      shiftId: morningShift.id,
    },
    {
      employeeCode: "EMP-002",
      firstName: "Sara",
      lastName: "Hassan",
      email: "sara.hassan@worktrack.com",
      phone: "+201002345678",
      departmentId: engineering.id,
      jobTitle: "Frontend Engineer",
      status: EEmployeeStatus.ACTIVE,
      hireDate: new Date("2024-01-15T00:00:00.000Z"),
      shiftId: morningShift.id,
    },
    {
      employeeCode: "EMP-003",
      firstName: "Nour",
      lastName: "El-Din",
      email: "nour.eldin@worktrack.com",
      phone: "+201003456789",
      departmentId: engineering.id,
      jobTitle: "DevOps Engineer",
      status: EEmployeeStatus.ACTIVE,
      hireDate: new Date("2022-08-10T00:00:00.000Z"),
      shiftId: morningShift.id,
    },
    {
      employeeCode: "EMP-004",
      firstName: "Karim",
      lastName: "Fouad",
      email: "karim.fouad@worktrack.com",
      phone: "+201004567890",
      departmentId: sales.id,
      jobTitle: "Sales Manager",
      status: EEmployeeStatus.ACTIVE,
      hireDate: new Date("2021-05-20T00:00:00.000Z"),
      shiftId: morningShift.id,
    },
    {
      employeeCode: "EMP-005",
      firstName: "Hany",
      lastName: "Rashad",
      email: "hany.rashad@worktrack.com",
      phone: "+201005678901",
      departmentId: sales.id,
      jobTitle: "Account Executive",
      status: EEmployeeStatus.ACTIVE,
      hireDate: new Date("2024-06-01T00:00:00.000Z"),
      shiftId: morningShift.id,
    },
    {
      employeeCode: "EMP-006",
      firstName: "Yara",
      lastName: "Samir",
      email: "yara.samir@worktrack.com",
      phone: "+201006789012",
      departmentId: humanResources.id,
      jobTitle: "HR Specialist",
      status: EEmployeeStatus.ACTIVE,
      hireDate: new Date("2023-09-12T00:00:00.000Z"),
      shiftId: morningShift.id,
    },
    {
      employeeCode: "EMP-007",
      firstName: "Mostafa",
      lastName: "Ali",
      email: "mostafa.ali@worktrack.com",
      phone: "+201007890123",
      departmentId: finance.id,
      jobTitle: "Accountant",
      status: EEmployeeStatus.ACTIVE,
      hireDate: new Date("2022-11-07T00:00:00.000Z"),
      shiftId: flexibleShift.id,
    },
    {
      employeeCode: "EMP-008",
      firstName: "Salma",
      lastName: "Nabil",
      email: "salma.nabil@worktrack.com",
      phone: "+201008901234",
      departmentId: finance.id,
      jobTitle: "Financial Analyst",
      status: EEmployeeStatus.ACTIVE,
      hireDate: new Date("2025-02-03T00:00:00.000Z"),
      shiftId: flexibleShift.id,
    },
    {
      employeeCode: "EMP-009",
      firstName: "Ali",
      lastName: "Gamal",
      email: "ali.gamal@worktrack.com",
      phone: "+201009012345",
      departmentId: operations.id,
      jobTitle: "Operations Lead",
      status: EEmployeeStatus.ACTIVE,
      hireDate: new Date("2020-04-18T00:00:00.000Z"),
      shiftId: eveningShift.id,
    },
    {
      employeeCode: "EMP-010",
      firstName: "Maha",
      lastName: "Tarek",
      email: "maha.tarek@worktrack.com",
      phone: "+201000123456",
      departmentId: operations.id,
      jobTitle: "Operations Coordinator",
      status: EEmployeeStatus.INACTIVE,
      hireDate: new Date("2019-10-01T00:00:00.000Z"),
      shiftId: eveningShift.id,
    },
  ];

  const employees = [];

  for (const input of employeeInputs) {
    const employee = await prisma.employee.create({
      data: {
        employeeCode: input.employeeCode,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        departmentId: input.departmentId,
        jobTitle: input.jobTitle,
        status: input.status,
        hireDate: input.hireDate,
      },
    });

    employees.push({ ...employee, shiftId: input.shiftId });
  }

  await prisma.employeeShift.createMany({
    data: employees.map((employee, index) => ({
      employeeId: employee.id,
      shiftId: employee.shiftId,
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate:
        employee.status === EEmployeeStatus.INACTIVE
          ? new Date("2026-06-30T00:00:00.000Z")
          : null,
      isActive: employee.status === EEmployeeStatus.ACTIVE && index < 10,
    })),
  });

  const activeEmployees = employees.filter(
    (employee) => employee.status === EEmployeeStatus.ACTIVE,
  );

  const attendanceDays = [-2, -1, 0];

  const attendanceLogs = activeEmployees.flatMap((employee, employeeIndex) =>
    attendanceDays.flatMap((offset) => {
      const date = startOfUtcDay(offset);
      const isLate = (employeeIndex + Math.abs(offset)) % 4 === 0;
      const checkIn = atUtcTime(date, 9, isLate ? 20 : 5);
      const checkOut = atUtcTime(date, 17, 0);
      const source =
        employeeIndex % 2 === 0 ? EAttendanceSource.CSV : EAttendanceSource.MANUAL;
      const createdById = employeeIndex % 2 === 0 ? hr.id : admin.id;

      return [
        {
          employeeId: employee.id,
          type: EAttendanceType.CHECK_IN,
          timestamp: checkIn,
          source,
          createdById,
        },
        {
          employeeId: employee.id,
          type: EAttendanceType.CHECK_OUT,
          timestamp: checkOut,
          source,
          createdById,
        },
      ];
    }),
  );

  await prisma.attendanceLog.createMany({ data: attendanceLogs });

  const attendanceRecords = activeEmployees.flatMap((employee, employeeIndex) =>
    attendanceDays.map((offset) => {
      const date = startOfUtcDay(offset);
      const isLate = (employeeIndex + Math.abs(offset)) % 4 === 0;
      const isAbsent = employeeIndex === 5 && offset === -2;
      const checkIn = isAbsent ? null : atUtcTime(date, 9, isLate ? 20 : 5);
      const checkOut = isAbsent ? null : atUtcTime(date, 17, 0);
      const lateMinutes = isLate ? 20 : 0;

      return {
        employeeId: employee.id,
        shiftId: employee.shiftId,
        date,
        checkIn,
        checkOut,
        status: isAbsent
          ? EAttendanceStatus.ABSENT
          : isLate
            ? EAttendanceStatus.LATE
            : EAttendanceStatus.PRESENT,
        workingMinutes: isAbsent ? 0 : 480 - lateMinutes,
        lateMinutes,
        earlyLeaveMinutes: 0,
        overtimeMinutes: offset === 0 ? 30 : 0,
        notes: isAbsent ? "Unplanned absence" : null,
        processedAt: new Date(),
      };
    }),
  );

  await prisma.attendanceRecord.createMany({ data: attendanceRecords });

  await prisma.uploadedFile.createMany({
    data: [
      {
        fileName: "employees-2026-11.csv",
        originalName: "employees.csv",
        type: EUploadType.EMPLOYEE_IMPORT,
        uploadedById: hr.id,
        totalRows: 10,
        successRows: 9,
        failedRows: 1,
      },
      {
        fileName: "attendance-2026-11.csv",
        originalName: "attendance.csv",
        type: EUploadType.ATTENDANCE_IMPORT,
        uploadedById: admin.id,
        totalRows: 54,
        successRows: 54,
        failedRows: 0,
      },
      {
        fileName: "attendance-correction.csv",
        originalName: "attendance-correction.csv",
        type: EUploadType.ATTENDANCE_IMPORT,
        uploadedById: hr2.id,
        totalRows: 27,
        successRows: 26,
        failedRows: 1,
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: "CREATE",
        entity: "Department",
        entityId: engineering.id,
        details: { name: "Engineering" },
      },
      {
        userId: hr.id,
        action: "CREATE",
        entity: "Employee",
        entityId: employees[0]?.id,
        details: { employeeCode: "EMP-001", department: "Engineering" },
      },
      {
        userId: hr.id,
        action: "IMPORT",
        entity: "Employee",
        entityId: null,
        details: { fileName: "employees-2026-11.csv", successRows: 9, failedRows: 1 },
      },
      {
        userId: admin.id,
        action: "IMPORT",
        entity: "AttendanceLog",
        entityId: null,
        details: { fileName: "attendance-2026-11.csv", successRows: 54, failedRows: 0 },
      },
      {
        userId: manager.id,
        action: "VIEW",
        entity: "AttendanceRecord",
        entityId: null,
        details: { scope: "Engineering", period: "last 3 days" },
      },
      {
        userId: hr2.id,
        action: "UPDATE",
        entity: "Shift",
        entityId: flexibleShift.id,
        details: { field: "graceMinutes", from: 15, to: 20 },
      },
    ],
  });

  console.info("Seed completed", {
    users: 4,
    departments: 5,
    employees: employees.length,
    shifts: 3,
    attendanceLogs: attendanceLogs.length,
    attendanceRecords: attendanceRecords.length,
    uploadedFiles: 3,
    auditLogs: 6,
    password: seedPassword,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
