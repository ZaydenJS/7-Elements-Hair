param([string]$InPath='new-styles.css',[string]$OutPath='new-styles.min.css')

# Use different variable names to avoid clashing with automatic $input variable
$css = Get-Content -Path $InPath -Raw
# Remove comments
$css = [regex]::Replace($css, '/\*[^*]*\*+(?:[^/*][^*]*\*+)*/', '')
# Collapse whitespace
$css = $css -replace '\s+', ' '
# Remove spaces around symbols
$css = $css -replace '\s*([{}:;,>\(\)])\s*', '$1'
# Trim
$css = $css.Trim()
Set-Content -Path $OutPath -Value $css -NoNewline
$len=(Get-Item $OutPath).Length
Write-Host "Minified $InPath -> $OutPath ($len bytes)"

