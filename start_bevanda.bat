@echo off
start "Bevanda Backend" cmd /k "cd /d C:\Users\user\Desktop\sia2\backend && env\Scripts\activate && python serve.py"
timeout /t 3 /nobreak >nul
start "Bevanda Frontend" cmd /k "serve -s C:\Users\user\Desktop\sia2\frontend\dist -l 5173"
