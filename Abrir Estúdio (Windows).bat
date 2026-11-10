@echo off
rem Estudio de videos: abre o estudio no navegador. Deixe a janela aberta enquanto usa.
setlocal
cd /d "%~dp0"
rem Usa esta pasta do repositorio; nao copia para C:\ilustrando.
set "ILU_SEM_MUDANCA=1"
rem aberto de dentro do .zip, o Windows extrai so este arquivo para uma pasta temporaria: avisa em vez de piscar e fechar
if not exist "%~dp0ferramentas\instalador\abrir.ps1" goto zip
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0ferramentas\instalador\abrir.ps1" %*
set "CODIGO=%ERRORLEVEL%"
rem 10 = o proprio PowerShell ja mostrou o problema e esperou o Enter
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
echo   Depois abra o disco C, entre na pasta ilustrando-metodo e de dois cliques em Abrir Estudio.
echo.
pause
set "CODIGO=1"
:fim
endlocal & exit /b %CODIGO%
