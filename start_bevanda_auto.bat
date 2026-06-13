@echo off
REM Start Bevanda Backend
cd /d C:\Users\dell\Desktop\sia2\backend
call ..\env\Scripts\activate.bat
start cmd /k "python serve.py"

REM Start Bevanda Frontend
cd /d C:\Users\dell\Desktop\sia2\frontend
start cmd /k "npx serve -s dist -l 5173"
