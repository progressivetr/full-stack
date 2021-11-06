insert into "Role"("id", "name") values (1, 'Admin');
insert into "User"("email", "password", "roleId") values ('admin@admin.com','$2b$10$OIZMlZvqmaZg31omKkUti.TJKBbWf16eWtL.IhxjW2zs4sLysLZmC', 1);
insert into "Permission"("id", "name") values (1, 'SHOW_PAGE');
insert into "_PermissionToRole"("A", "B") values (1, 1);