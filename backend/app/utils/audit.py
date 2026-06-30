from app.models.audit_log import AuditLog


def create_audit_log(
    db,
    user_id,
    action,
    table_name,
    record_id,
    description
):
    log = AuditLog(
        user_id=user_id,
        action=action,
        table_name=table_name,
        record_id=record_id,
        description=description
    )

    db.add(log)
    db.commit()