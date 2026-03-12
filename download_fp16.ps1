$ErrorActionPreference = "Stop"

$oldDir = "public/yolov8n_web_model"
if (Test-Path $oldDir) {
    Remove-Item -Recurse -Force "$oldDir\*"
}
else {
    New-Item -ItemType Directory -Force -Path $oldDir
}

$repoUrl = "https://api.github.com/repos/Hyuto/yolov8-tfjs/git/trees/master?recursive=1"
$files = (Invoke-RestMethod -Uri $repoUrl).tree | Where-Object { $_.path -match '^public/yolov8n_web_model/' -and $_.type -eq 'blob' }

foreach ($f in $files) {
    $rawUrl = "https://raw.githubusercontent.com/Hyuto/yolov8-tfjs/master/" + $f.path
    $localPath = $f.path
    Write-Host "Downloading $($f.path)..."
    Invoke-WebRequest -Uri $rawUrl -OutFile $localPath
}
Write-Host "Download complete!"
