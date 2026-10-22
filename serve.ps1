param([int]$Port = 5500)

$projectRoot = (Resolve-Path $PWD).Path
$siteRoot = Join-Path $projectRoot "docs"

$mime = @{
  ".html" = "text/html; charset=utf-8"; ".css" = "text/css"; ".js" = "application/javascript";
  ".png" = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"; ".svg" = "image/svg+xml";
  ".pdf" = "application/pdf"; ".ico" = "image/x-icon"
}

$lanIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
  $_.IPAddress -notlike '169.254*' -and $_.IPAddress -ne '127.0.0.1' -and $_.InterfaceAlias -notmatch 'Loopback'
} | Select-Object -First 1).IPAddress

# Socket TCP crudo: a diferencia de HttpListener, no requiere permisos de administrador
# ni reserva de URL ACL para aceptar conexiones desde otros dispositivos de la red.
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$listener.Start()

Write-Host "Serving $projectRoot"
Write-Host "Local:  http://localhost:$Port/"
if ($lanIp) { Write-Host "Red local (celular/otra PC en el mismo WiFi): http://${lanIp}:$Port/" }

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII)

    $requestLine = $reader.ReadLine()
    while ($true) {
      $line = $reader.ReadLine()
      if ([string]::IsNullOrEmpty($line)) { break }
    }

    $filePath = $null
    $relPath = "/"
    if ($requestLine -match '^(GET|HEAD)\s+(\S+)\s+HTTP') {
      $rawPath = $matches[2] -replace '\?.*$', ''
      $relPath = [System.Uri]::UnescapeDataString($rawPath)
      if ($relPath -eq "/") { $relPath = "/index.html" }
      $cleanRel = $relPath.TrimStart("/") -replace "/", "\"

      $candidateSite = Join-Path $siteRoot $cleanRel
      $candidateRoot = Join-Path $projectRoot $cleanRel
      if (Test-Path $candidateSite -PathType Leaf) {
        $filePath = (Resolve-Path $candidateSite).Path
      } elseif (Test-Path $candidateRoot -PathType Leaf) {
        $filePath = (Resolve-Path $candidateRoot).Path
      }
      # Evitar que se pueda salir de la carpeta del proyecto con "..".
      if ($filePath -and -not $filePath.StartsWith($projectRoot)) { $filePath = $null }
    }

    $writer = New-Object System.IO.BinaryWriter($stream)
    if ($filePath) {
      $ext = [System.IO.Path]::GetExtension($filePath)
      $contentType = $mime[$ext]
      if (-not $contentType) { $contentType = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
      $writer.Write([System.Text.Encoding]::ASCII.GetBytes($header))
      $writer.Write($bytes)
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
      $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $writer.Write([System.Text.Encoding]::ASCII.GetBytes($header))
      $writer.Write($body)
    }
    $writer.Flush()
  } catch {
  } finally {
    $client.Close()
  }
}
