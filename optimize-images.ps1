Add-Type -AssemblyName System.Drawing

$srcDir = Join-Path $PWD "Renders"
$outDir = Join-Path $PWD "docs/Renders-web"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$maxWidth = 1800
$quality = 80

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)

Get-ChildItem "$srcDir\*.png" | ForEach-Object {
  $src = $_.FullName
  $name = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
  $destPath = Join-Path $outDir ($name + ".jpg")

  $original = [System.Drawing.Image]::FromFile($src)
  $ratio = [Math]::Min(1.0, $maxWidth / $original.Width)
  $newW = [int]($original.Width * $ratio)
  $newH = [int]($original.Height * $ratio)

  $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
  $bmp.SetResolution($original.HorizontalResolution, $original.VerticalResolution)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.DrawImage($original, 0, 0, $newW, $newH)

  # fondo blanco por si hay transparencia (JPEG no soporta alpha)
  $final = New-Object System.Drawing.Bitmap($newW, $newH)
  $gf = [System.Drawing.Graphics]::FromImage($final)
  $gf.Clear([System.Drawing.Color]::White)
  $gf.DrawImage($bmp, 0, 0)

  $final.Save($destPath, $jpegCodec, $encParams)

  $g.Dispose(); $gf.Dispose(); $bmp.Dispose(); $final.Dispose(); $original.Dispose()

  $origSize = (Get-Item $src).Length / 1MB
  $newSize = (Get-Item $destPath).Length / 1MB
  "{0}: {1:N2} MB -> {2:N2} MB" -f $_.Name, $origSize, $newSize
}
