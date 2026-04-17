# Database Migrations Guide

## Important: Schema Changes Applied

The Prisma schema has been updated with the following improvements:

### 1. Database Indexes Added
- **Sales**: `date`, `amount`, `date,amount`
- **Expenses**: `date`, `amount`, `date,amount`
- **Clients**: `name`, `totalDebt`, `phone` (unique)
- **Debts**: `clientId`, `status`, `direction`, `dueDate`, `date`, `amount`, `status,direction`
- **Reminders**: `status`, `remindAt`, `eventAt`, `notified`, `status,remindAt`
- **WebPushSubscription**: `createdAt`, `updatedAt`

### 2. Field Constraints Added
- Added `@db.VarChar(255)` to text fields for better performance
- Added `@db.Text` for large text fields (WebPushSubscription)
- Added `createdAt` and `updatedAt` timestamps where missing

## Migration Steps

### For Development Environment

1. **Generate migration file:**
   ```bash
   npm run db:migrate:dev -- --name add_indexes_and_constraints
   ```

2. **Apply migration:**
   ```bash
   npm run db:migrate:dev
   ```

3. **Regenerate Prisma client:**
   ```bash
   npm run db:generate
   ```

### For Production Environment

1. **Generate migration in development first:**
   ```bash
   npm run db:migrate:dev -- --name add_indexes_and_constraints
   ```

2. **Review the generated migration file** in `prisma/migrations/`

3. **Apply to production:**
   ```bash
   npm run db:migrate:deploy
   ```

## Performance Benefits

The added indexes will significantly improve query performance for:
- Date-based filtering and sorting
- Amount-based queries and reports
- Client lookups and searches
- Debt status and direction filtering
- Reminder scheduling and status queries

## Migration File Location

After running the migration command, you'll find the migration file at:
```
prisma/migrations/<timestamp>_add_indexes_and_constraints/migration.sql
```

## Backup Recommendation

Before applying migrations to production:
1. Create a database backup
2. Test migrations on staging environment first
3. Verify application functionality after migration

## Rollback Plan

If issues occur:
1. Use `npm run db:migrate:reset` to reset (development only)
2. Restore from backup (production)
3. Revert schema changes in `prisma/schema.prisma`

## Verification

After migration, verify:
1. All indexes are created: `\di` in psql
2. Application queries are faster
3. No data loss occurred
4. All API endpoints work correctly
