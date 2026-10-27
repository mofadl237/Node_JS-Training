-- Create btree_gist extension if not exists (required for EXCLUDE with = and &&)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Prevent overlapping appointments for the same doctor when status is not CANCELED
-- Use tsrange with [) to allow adjacent bookings (end == start)
ALTER TABLE "Appointment"
  ADD CONSTRAINT appointment_no_overlap
  EXCLUDE USING gist (
    "doctorId" WITH =,
    tsrange("startsAt"::timestamp, "endsAt"::timestamp, '[)') WITH &&
  )
  WHERE ("status" <> 'CANCELED');
