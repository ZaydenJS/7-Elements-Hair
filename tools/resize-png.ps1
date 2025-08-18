# Resize a PNG while preserving transparency
param(
  [string]$InputPath = "Main Logo.png",
  [string]$OutputPath = "Main-Logo-300.png",
  [int]$MaxWidth = 300
)

Add-Type -AssemblyName System.Drawing
if (!(Test-Path $InputPath)) { Write-Host "Missing: $InputPath"; exit 1 }

$img = [System.Drawing.Image]::FromFile($InputPath)
try {
  $w = [int]$img.Width
  $h = [int]$img.Height
  if ($w -gt $MaxWidth) { $newW = $MaxWidth; $newH = [int]([double]$h * $newW / $w) } else { $newW = $w; $newH = $h }

  $bmp = New-Object System.Drawing.Bitmap($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear([System.Drawing.Color]::FromArgb(0,0,0,0))
  $g.DrawImage($img, 0, 0, $newW, $newH)
  $g.Dispose()

  # Save as PNG (transparency preserved)
  $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Saved: $OutputPath (" (Get-Item $OutputPath).Length ") bytes"
}
finally {
  $img.Dispose()
}

