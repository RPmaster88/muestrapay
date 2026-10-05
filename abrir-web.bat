@echo off
cd /d "%~dp0"
echo Abriendo http://127.0.0.1:8765/index.html
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://127.0.0.1:8765/index.html"

where py >nul 2>&1
if %errorlevel%==0 (
  py -3 -m http.server 8765
  goto :fail
)

where python >nul 2>&1
if %errorlevel%==0 (
  python -m http.server 8765
  goto :fail
)

echo.
echo No se encontro Python. Instala Python desde https://www.python.org/downloads/
echo y marca "Add python.exe to PATH".
pause
exit /b 1

:fail
echo.
echo El servidor se ha detenido. Si el puerto 8765 esta ocupado, cierra la otra ventana y vuelve a abrir este archivo.
pause
