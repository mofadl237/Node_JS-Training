# Architecture Review (EN/AR)

## Changes from previous enum-based proposal
- **Specializations:** `ESpecialization` enum → `Specialization` model (dynamic, admin-manageable, soft-deactivable). Doctor references via FK.
- **Services:** `EClinicServices` enum → `ClinicService` catalog + `DoctorService` per-doctor offering (separates catalog from pricing/duration).
- **Scheduling:** Fixed slots → `DoctorAvailability` periods; booking uses service duration and computes valid candidate times (must fit fully inside one availability period). No patient-defined slots.
- **Appointments:** Added snapshots `priceAtBooking`, `durationMinutesAtBooking`, optional name snapshots; store `startsAt/endAt`; status enum `BOOKED/CANCELED/COMPLETED`.

## Rationale
- Admin can add/edit/activate/deactivate without schema changes
- Different doctors can price/duration same service differently
- History preserved on renames/deactivations/price changes
- Supports variable durations correctly
- Safer against concurrency with transactions + DB constraints

## Tradeoffs
- More tables/joins vs simple enums
- Concurrency needs explicit handling (transactions + exclusion constraints recommended)
- Booking logic more complex (compute times) but more flexible
- Admin UX required for catalog/availability

## Remaining business decisions
- Allow multiple specializations per doctor? (current: single; many-to-many possible later)
- Enforce patient-overlap policy strictly?
- Implement PostgreSQL exclusion constraint in migration (Prisma may need raw SQL)
- Whether to snapshot service/doctor names in Appointment (added optional fields as minimal approach)

## Integrity strategy
1. Enforce in DB: FKs, uniques, indexes, onDelete policies
2. Enforce in transaction: load active DoctorService, validate doctor match, check availability covers interval, check doctor overlaps, check patient overlaps if policy requires, create with snapshots
3. Enforce in DB constraints: consider exclusion constraint on (doctorId, tstzrange/tsrange) WHERE status != 'CANCELED'; handle via custom SQL migration if needed
