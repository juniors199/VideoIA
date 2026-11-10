@echo off
rem Ilustrando Studio: um clique. Instala o que faltar e abre o estudio.
setlocal
cd /d "%~dp0"
rem Usa esta pasta do repositorio; nao copia para C:\ilustrando.
set "ILU_SEM_MUDANCA=1"
if not exist "%~dp0ferramentas\instalador\iniciar.ps1" goto zip
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0ferramentas\instalador\iniciar.ps1" %*
set "CODIGO=%ERRORLEVEL%"
if "%CODIGO%"=="0" goto fim
if "%CODIGO%"=="10" goto fim
echo.
echo   O Windows nao deixou o estudio comecar (codigo %CODIGO%).
echo   Tire uma foto desta janela e mande ao suporte.
echo.
pause
goto fim
:zip
echo.
echo   A pasta do estudio ainda esta dentro do arquivo .zip.
echo   Feche esta janela, clique com o botao direito no .zip e escolha "Extrair tudo".
echo   Clique em "Procurar...", escolha "Disco Local (C:)", "Selecionar pasta" e "Extrair".
echo   Depois abra o disco C, entre na pasta do estudio e de dois cliques em Iniciar.
echo.
pause
set "CODIGO=1"
:fim
endlocal & exit /b %CODIGO%