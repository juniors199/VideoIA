@echo off
rem Roda um comando do estudio com os programas portateis da pasta (.programas: Node, npm e FFmpeg).
rem Para o assistente no PowerShell ou no Prompt:  ferramentas\rodar.cmd npm run doctor
setlocal
set "AQUI=%~dp0.."
if exist "%AQUI%\.programas\node\node.exe" set "PATH=%AQUI%\.programas\node;%PATH%"
if exist "%AQUI%\.programas\ffmpeg\ffmpeg.exe" set "PATH=%AQUI%\.programas\ffmpeg;%PATH%"
cd /d "%AQUI%"
if "%~1"=="" (echo Uso: ferramentas\rodar.cmd ^<comando^>  [ex.: ferramentas\rodar.cmd npm run doctor] & exit /b 1)
call %*
set "CODIGO=%ERRORLEVEL%"
endlocal & exit /b %CODIGO%
