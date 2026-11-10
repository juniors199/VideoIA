# Inicia o estudio: instala o que faltar e abre no navegador. Quem chama: "Iniciar (Windows).cmd".
$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}
try { $Host.UI.RawUI.WindowTitle = 'Ilustrando Studio' } catch {}
$studio = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$playwright = Join-Path $studio 'node_modules\playwright'
$nodePortatil = Join-Path $studio '.programas\node\node.exe'
$temNode = (Test-Path -LiteralPath $nodePortatil)
if (-not $temNode) {
  $c = Get-Command node -ErrorAction SilentlyContinue
  if ($c) {
    try {
      $maior = [int](& $c.Source -p "process.versions.node.split('.')[0]")
      if ($maior -ge 20 -and $maior -lt 24) { $temNode = $true }
    } catch {}
  }
}
$instalar = Join-Path $PSScriptRoot 'instalar.ps1'
$abrir = Join-Path $PSScriptRoot 'abrir.ps1'
if (-not $temNode -or -not (Test-Path -LiteralPath $playwright)) {
  Write-Host ''
  Write-Host '  Ainda falta instalar. Vou instalar agora e abrir o estudio em seguida.'
  Write-Host ''
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $instalar @args
  exit $LASTEXITCODE
}
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $abrir @args
exit $LASTEXITCODE