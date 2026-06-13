@echo off
set MYSQL_USER=root
set MYSQL_PASSWORD=bvnda1023
set DB_NAME=bevanda_db
set BACKUP_DIR=C:\Users\user\Desktop\sia2\backups
set DATE_STR=%date:~10,4%-%date:~4,2%-%date:~7,2%

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump" -u %MYSQL_USER% -p%MYSQL_PASSWORD% %DB_NAME% > "%BACKUP_DIR%\bevanda_%DATE_STR%.sql"

:: Keep only last 30 backups
forfiles /p "%BACKUP_DIR%" /s /m *.sql /d -30 /c "cmd /c del @path" 2>nul

echo Backup complete: bevanda_%DATE_STR%.sql
