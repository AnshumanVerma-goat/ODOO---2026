"""initial schema for TransitOps"""

from alembic import op
import sqlalchemy as sa


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(length=64), nullable=False),
        sa.UniqueConstraint("name", name="uq_roles_name"),
    )
    op.create_index(op.f("ix_roles_id"), "roles", ["id"], unique=False)
    op.create_index(op.f("ix_roles_name"), "roles", ["name"], unique=False)

    op.create_table(
        "vehicles",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("registration_number", sa.String(length=64), nullable=False),
        sa.Column("vehicle_name", sa.String(length=120), nullable=False),
        sa.Column("vehicle_type", sa.String(length=80), nullable=False),
        sa.Column("maximum_load_capacity", sa.Float(), nullable=False),
        sa.Column("odometer", sa.Integer(), nullable=False),
        sa.Column("acquisition_cost", sa.Float(), nullable=False),
        sa.Column("current_status", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("registration_number", name="uq_vehicles_registration_number"),
    )
    op.create_index(op.f("ix_vehicles_id"), "vehicles", ["id"], unique=False)
    op.create_index(op.f("ix_vehicles_registration_number"), "vehicles", ["registration_number"], unique=False)
    op.create_index(op.f("ix_vehicles_current_status"), "vehicles", ["current_status"], unique=False)

    op.create_table(
        "drivers",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("full_name", sa.String(length=150), nullable=False),
        sa.Column("license_number", sa.String(length=64), nullable=False),
        sa.Column("license_category", sa.String(length=32), nullable=False),
        sa.Column("license_expiry", sa.Date(), nullable=False),
        sa.Column("contact_number", sa.String(length=32), nullable=False),
        sa.Column("safety_score", sa.Float(), nullable=False),
        sa.Column("current_status", sa.String(length=32), nullable=False),
        sa.UniqueConstraint("license_number", name="uq_drivers_license_number"),
    )
    op.create_index(op.f("ix_drivers_id"), "drivers", ["id"], unique=False)
    op.create_index(op.f("ix_drivers_license_number"), "drivers", ["license_number"], unique=False)
    op.create_index(op.f("ix_drivers_current_status"), "drivers", ["current_status"], unique=False)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["role_id"], ["roles.id"], ondelete="RESTRICT"),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=False)

    op.create_table(
        "trips",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("source", sa.String(length=255), nullable=False),
        sa.Column("destination", sa.String(length=255), nullable=False),
        sa.Column("vehicle_id", sa.Integer(), nullable=True),
        sa.Column("driver_id", sa.Integer(), nullable=True),
        sa.Column("cargo_weight", sa.Float(), nullable=False),
        sa.Column("planned_distance", sa.Float(), nullable=False),
        sa.Column("actual_distance", sa.Float(), nullable=True),
        sa.Column("revenue", sa.Float(), nullable=False),
        sa.Column("fuel_used", sa.Float(), nullable=True),
        sa.Column("trip_status", sa.String(length=32), nullable=False),
        sa.Column("dispatch_time", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completion_time", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["vehicle_id"], ["vehicles.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["driver_id"], ["drivers.id"], ondelete="SET NULL"),
    )
    op.create_index(op.f("ix_trips_id"), "trips", ["id"], unique=False)
    op.create_index(op.f("ix_trips_trip_status"), "trips", ["trip_status"], unique=False)

    op.create_table(
        "maintenance_logs",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("vehicle_id", sa.Integer(), nullable=False),
        sa.Column("maintenance_type", sa.String(length=80), nullable=False),
        sa.Column("description", sa.String(length=500), nullable=False),
        sa.Column("maintenance_cost", sa.Float(), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("active", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["vehicle_id"], ["vehicles.id"], ondelete="CASCADE"),
    )
    op.create_index(op.f("ix_maintenance_logs_id"), "maintenance_logs", ["id"], unique=False)

    op.create_table(
        "fuel_logs",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("vehicle_id", sa.Integer(), nullable=False),
        sa.Column("trip_id", sa.Integer(), nullable=True),
        sa.Column("liters", sa.Float(), nullable=False),
        sa.Column("cost", sa.Float(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(["vehicle_id"], ["vehicles.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["trip_id"], ["trips.id"], ondelete="SET NULL"),
    )
    op.create_index(op.f("ix_fuel_logs_id"), "fuel_logs", ["id"], unique=False)

    op.create_table(
        "expenses",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("vehicle_id", sa.Integer(), nullable=False),
        sa.Column("expense_type", sa.String(length=80), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("remarks", sa.String(length=500), nullable=True),
        sa.Column("expense_date", sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(["vehicle_id"], ["vehicles.id"], ondelete="CASCADE"),
    )
    op.create_index(op.f("ix_expenses_id"), "expenses", ["id"], unique=False)


def downgrade() -> None:
    op.drop_table("expenses")
    op.drop_table("fuel_logs")
    op.drop_table("maintenance_logs")
    op.drop_table("trips")
    op.drop_table("users")
    op.drop_table("drivers")
    op.drop_table("vehicles")
    op.drop_table("roles")
