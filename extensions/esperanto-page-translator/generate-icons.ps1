# Generate placeholder icon PNG files for Chrome extension
Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [int]$Size,
        [string]$OutputPath
    )

    # Create bitmap
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

    # Set high quality rendering
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Fill with green background (#2e7d32)
    $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(46, 125, 50))
    $graphics.FillRectangle($greenBrush, 0, 0, $Size, $Size)

    # Draw white "E" text
    $font = New-Object System.Drawing.Font("Arial", [int]($Size * 0.5), [System.Drawing.FontStyle]::Bold)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)

    $graphics.DrawString("E", $font, $whiteBrush, $rect, $format)

    # Save PNG
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $greenBrush.Dispose()
    $whiteBrush.Dispose()
    $font.Dispose()

    Write-Host "Created $OutputPath"
}

# Create icons directory if it doesn't exist
$iconsDir = "dist\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
}

# Also create in public/icons for source
$publicIconsDir = "public\icons"
if (-not (Test-Path $publicIconsDir)) {
    New-Item -ItemType Directory -Path $publicIconsDir | Out-Null
}

# Generate icons
Create-Icon -Size 16 -OutputPath "$iconsDir\icon16.png"
Create-Icon -Size 48 -OutputPath "$iconsDir\icon48.png"
Create-Icon -Size 128 -OutputPath "$iconsDir\icon128.png"

Create-Icon -Size 16 -OutputPath "$publicIconsDir\icon16.png"
Create-Icon -Size 48 -OutputPath "$publicIconsDir\icon48.png"
Create-Icon -Size 128 -OutputPath "$publicIconsDir\icon128.png"

Write-Host "`nAll icons generated successfully!"
