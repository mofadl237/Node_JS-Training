# ERD Explanation - Clinica

## Overview
Clinica uses a dynamic, admin-manageable catalog (no hard-coded enums for specializations/services). All critical booking data is snapshotted to preserve history.

## Entities

### User
Core account. Roles: PATIENT, DOCTOR, ADMIN. Has optional Doctor profile and appointments as patient.

### Specialization
Dynamic medical specializations. Doctor references via FK. Deactivation via `isActive` (soft) to avoid breaking history.

### Doctor
Linked 1:1 to User. Belongs to a Specialization. Has availabilities, doctor services, and appointments.

### ClinicService
Shared service catalog (e.g., CONSULTATION, FOLLOW_UP). Not automatically offered by all doctors.

### DoctorService
Doctor-specific offering linking Doctor and ClinicService with `price` (Decimal), `durationMinutes` (Int), `isActive`. Unique on (doctorId, clinicServiceId). Admin controls pricing/duration.

### DoctorAvailability
Admin-defined continuous working intervals. System computes bookable times based on service duration and validates full containment + no overlaps.

### Appointment
Actual booking with `startsAt`, `endsAt`, `status` (BOOKED/CANCELED/COMPLETED), `priceAtBooking`, `durationMinutesAtBooking`, and optional snapshots. Immutable history on price/duration.

## Relationships
- User ||--o| Doctor
- User ||--o{ Appointment (as patient)
- Specialization ||--o{ Doctor
- Doctor ||--o{ DoctorAvailability
- Doctor ||--o{ DoctorService
- Doctor ||--o{ Appointment
- ClinicService ||--o{ DoctorService
- DoctorService ||--o{ Appointment

## Key Design Notes
- Prices use PostgreSQL Decimal; durations in minutes
- Dynamic scheduling (availability periods) not fixed slots
- Snapshots prevent historical corruption
- Concurrency control required (transactions + DB constraints/exclusion)
- Canceled/completed remain for history; cancel does not block interval permanently
