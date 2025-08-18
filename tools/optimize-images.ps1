# Optimize images for web: resize and re-encode JPEGs
# Requires Windows with .NET (System.Drawing)

Add-Type -AssemblyName System.Drawing

function Save-ResizedJpeg {
    param(
        [Parameter(Mandatory=$true)][string]$InputPath,
        [Parameter(Mandatory=$true)][string]$OutputPath,
        [int]$MaxWidth = 800,
        [int]$Quality = 70
    )
    if (!(Test-Path $InputPath)) { Write-Host "Missing: $InputPath"; return }
    $img = [System.Drawing.Image]::FromFile($InputPath)
    try {
        $w = [int]$img.Width
        $h = [int]$img.Height
        if ($w -gt $MaxWidth) {
            $newW = $MaxWidth
            $newH = [int]([double]$h * $newW / $w)
        } else {
            $newW = $w
            $newH = $h
        }
        $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()

        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int]$Quality)

        $dir = Split-Path $OutputPath -Parent
        if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
        $bmp.Save($OutputPath, $jpegCodec, $encParams)
        $bmp.Dispose()
        Write-Host "Saved: $OutputPath"
    }
    finally {
        $img.Dispose()
    }
}

# Create optimized variants
Save-ResizedJpeg -InputPath "Photos/Blonde.jpg" -OutputPath "Photos/Blonde-800.jpg" -MaxWidth 800 -Quality 70
Save-ResizedJpeg -InputPath "Photos/Get in touch.jpg" -OutputPath "Photos/Get-in-touch-800.jpg" -MaxWidth 800 -Quality 70
Save-ResizedJpeg -InputPath "Photos/Hero.jpg" -OutputPath "Photos/Hero-800.jpg" -MaxWidth 1000 -Quality 75
# Compress the large PNG logo into a smaller JPEG for navbar (visual difference minimal at this size)
Save-ResizedJpeg -InputPath "Main Logo.png" -OutputPath "Main-Logo-300.jpg" -MaxWidth 300 -Quality 75

