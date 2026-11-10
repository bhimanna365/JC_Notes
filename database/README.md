# JC Notes Database

This folder provides schema and seed files for future relational or document database integration.

## Files
- `schema/schema.sql`: Table definitions for subjects, curriculum units, academic documents, exam papers, and student progress tracking.
- `seed/seed.sql`: Initial seed data for Semester III autonomous curriculum courses.

## Future Setup
When integrating with PostgreSQL or Supabase:
```bash
psql -U your_user -d your_db -f database/schema/schema.sql
psql -U your_user -d your_db -f database/seed/seed.sql
```
