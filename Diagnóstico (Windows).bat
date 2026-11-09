@echo off
rem Ilustrando Studio: diagnostico para mandar no direct, SEM precisar do estudio aberto. Copia o texto sozinho.
setlocal
cd /d "%~dp0"
set "NODE="
if exist "%~dp0.programas\node\node.exe" set "NODE=%~dp0.programas\node\node.exe"
if not defined NODE where node.exe >nul 2>nul && set "NODE=node.exe"
if defined NODE goto comnode
echo.
echo   O Node (o motor do estudio) ainda nao esta instalado neste computador.
echo   Aqui vai o que a instalacao registrou. Tire uma foto desta janela e mande no direct do Instagram @ilustrandocuriosidades.
echo.
if exist "%~dp0.estudio\instalacao.log" (powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -LiteralPath '.estudio\instalacao.log' -Tail 30 -Encoding UTF8") else (echo   Nenhum registro de instalacao encontrado.)
echo.
echo   Sistema:
ver
echo.
pause
goto fim
:comnode
"%NODE%" "%~dp0ferramentas\instalador\diagnostico.mjs"
echo.
pause
:fim
endlocal
