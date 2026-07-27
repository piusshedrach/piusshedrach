Add-Type -AssemblyName System.Drawing

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$fontCollection = New-Object System.Drawing.Text.PrivateFontCollection
$fontCollection.AddFontFile((Join-Path $root 'src\fonts\Calibre\Calibre-Semibold.ttf'))
$fontFamily = $fontCollection.Families[0]

function New-Canvas {
  param([int]$Width, [int]$Height, [bool]$Transparent = $false)

  $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  if ($Transparent) {
    $graphics.Clear([System.Drawing.Color]::Transparent)
  } else {
    $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#020c1b'))
  }

  return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function Draw-PMark {
    param(
        [System.Drawing.Graphics]$Graphics,
        [float]$X,
        [float]$Y,
        [float]$Size,
        [bool]$FillHex = $true
    )

    $green = [System.Drawing.ColorTranslator]::FromHtml('#64ffda')
    $navy  = [System.Drawing.ColorTranslator]::FromHtml('#0a192f')

    # Draw hexagon
    $points = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new($X + ($Size * 0.50), $Y + ($Size * 0.03)),
        [System.Drawing.PointF]::new($X + ($Size * 0.90), $Y + ($Size * 0.26)),
        [System.Drawing.PointF]::new($X + ($Size * 0.90), $Y + ($Size * 0.72)),
        [System.Drawing.PointF]::new($X + ($Size * 0.50), $Y + ($Size * 0.96)),
        [System.Drawing.PointF]::new($X + ($Size * 0.10), $Y + ($Size * 0.72)),
        [System.Drawing.PointF]::new($X + ($Size * 0.10), $Y + ($Size * 0.26))
    )

    if ($FillHex) {
        $fillBrush = New-Object System.Drawing.SolidBrush($navy)
        $Graphics.FillPolygon($fillBrush, $points)
        $fillBrush.Dispose()
    }

    $pen = New-Object System.Drawing.Pen($green, [Math]::Max(2, $Size * 0.025))
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $Graphics.DrawPolygon($pen, $points)
    $pen.Dispose()

    # Create glyph path
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $format = New-Object System.Drawing.StringFormat

    $path.AddString(
        'P',
        $fontFamily,
        [int][System.Drawing.FontStyle]::Regular,
        100,
        [System.Drawing.PointF]::new(0,0),
        $format
    )

    # Measure glyph
    $bounds = $path.GetBounds()

    # Target height (~42% of logo)
    $targetHeight = $Size * 0.42
    $scale = $targetHeight / $bounds.Height

    $matrix = New-Object System.Drawing.Drawing2D.Matrix
    $matrix.Scale($scale, $scale)
    $path.Transform($matrix)

    # Measure again after scaling
    $bounds = $path.GetBounds()

    # Center glyph
    $translateX = $X + ($Size / 2) - ($bounds.Left + ($bounds.Width / 2))
    $translateY = $Y + ($Size / 2) - ($bounds.Top + ($bounds.Height / 2))

    # Optical adjustments
    $translateX += $Size * 0.01
    $translateY -= $Size * 0.005

    $matrix.Reset()
    $matrix.Translate($translateX, $translateY)
    $path.Transform($matrix)

    $brush = New-Object System.Drawing.SolidBrush($green)
    $Graphics.FillPath($brush, $path)

    $brush.Dispose()
    $matrix.Dispose()
    $path.Dispose()
    $format.Dispose()
}

function Save-Logo {
  param([int]$Size, [string]$Path)

  $canvas = New-Canvas -Width $Size -Height $Size -Transparent $true
  Draw-PMark -Graphics $canvas.Graphics -X 0 -Y 0 -Size $Size
  $canvas.Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Dispose()
}

$logoPath = Join-Path $root 'src\images\logo.png'
Save-Logo -Size 512 -Path $logoPath

$faviconDirectory = Join-Path $root 'src\images\favicons'
$faviconSizes = @{
  'android-icon-36x36.png' = 36
  'android-icon-48x48.png' = 48
  'android-icon-72x72.png' = 72
  'android-icon-96x96.png' = 96
  'android-icon-144x144.png' = 144
  'android-icon-192x192.png' = 192
  'apple-icon.png' = 180
  'apple-icon-precomposed.png' = 180
  'apple-icon-57x57.png' = 57
  'apple-icon-60x60.png' = 60
  'apple-icon-72x72.png' = 72
  'apple-icon-76x76.png' = 76
  'apple-icon-114x114.png' = 114
  'apple-icon-120x120.png' = 120
  'apple-icon-144x144.png' = 144
  'apple-icon-152x152.png' = 152
  'apple-icon-180x180.png' = 180
  'favicon-16x16.png' = 16
  'favicon-32x32.png' = 32
  'favicon-96x96.png' = 96
  'ms-icon-70x70.png' = 70
  'ms-icon-144x144.png' = 144
  'ms-icon-150x150.png' = 150
  'ms-icon-310x310.png' = 310
}

foreach ($item in $faviconSizes.GetEnumerator()) {
  Save-Logo -Size $item.Value -Path (Join-Path $faviconDirectory $item.Key)
}

$iconCanvas = New-Canvas -Width 64 -Height 64 -Transparent $true
Draw-PMark -Graphics $iconCanvas.Graphics -X 0 -Y 0 -Size 64
$icon = [System.Drawing.Icon]::FromHandle($iconCanvas.Bitmap.GetHicon())
$stream = [System.IO.File]::Create((Join-Path $faviconDirectory 'favicon.ico'))
$icon.Save($stream)
$stream.Dispose()
$icon.Dispose()
$iconCanvas.Graphics.Dispose()
$iconCanvas.Bitmap.Dispose()

function Save-OgImage {
  param([int]$Scale, [string]$Path)

  $width = 1200 * $Scale
  $height = 630 * $Scale
  $canvas = New-Canvas -Width $width -Height $height
  $graphics = $canvas.Graphics
  $green = [System.Drawing.ColorTranslator]::FromHtml('#64ffda')
  $light = [System.Drawing.ColorTranslator]::FromHtml('#ccd6f6')
  $slate = [System.Drawing.ColorTranslator]::FromHtml('#8892b0')
  $line = [System.Drawing.ColorTranslator]::FromHtml('#233554')

  $gridPen = New-Object System.Drawing.Pen($line, $Scale)
  for ($x = 0; $x -lt $width; $x += (80 * $Scale)) {
    $graphics.DrawLine($gridPen, $x, 0, $x, $height)
  }
  for ($y = 0; $y -lt $height; $y += (80 * $Scale)) {
    $graphics.DrawLine($gridPen, 0, $y, $width, $y)
  }
  $gridPen.Dispose()

  Draw-PMark -Graphics $graphics -X (72 * $Scale) -Y (62 * $Scale) -Size (130 * $Scale)

  $eyebrowFont = New-Object System.Drawing.Font($fontFamily, (23 * $Scale), [System.Drawing.FontStyle]::Regular)
  $nameFont = New-Object System.Drawing.Font($fontFamily, (76 * $Scale), [System.Drawing.FontStyle]::Regular)
  $taglineFont = New-Object System.Drawing.Font($fontFamily, (38 * $Scale), [System.Drawing.FontStyle]::Regular)
  $greenBrush = New-Object System.Drawing.SolidBrush($green)
  $lightBrush = New-Object System.Drawing.SolidBrush($light)
  $slateBrush = New-Object System.Drawing.SolidBrush($slate)

  $graphics.DrawString('BUSINESS-FOCUSED WEB DESIGN', $eyebrowFont, $greenBrush, (250 * $Scale), (75 * $Scale))
  $graphics.DrawString('Pius Shedrach', $nameFont, $lightBrush, (72 * $Scale), (230 * $Scale))
  $graphics.DrawString(
    'Websites that help businesses earn trust',
    $taglineFont,
    $slateBrush,
    [System.Drawing.RectangleF]::new((78 * $Scale), (365 * $Scale), (980 * $Scale), (70 * $Scale))
  )
  $graphics.DrawString(
    'and win more clients.',
    $taglineFont,
    $greenBrush,
    [System.Drawing.RectangleF]::new((78 * $Scale), (430 * $Scale), (980 * $Scale), (70 * $Scale))
  )

  $greenBrush.Dispose()
  $lightBrush.Dispose()
  $slateBrush.Dispose()
  $eyebrowFont.Dispose()
  $nameFont.Dispose()
  $taglineFont.Dispose()
  $canvas.Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $canvas.Bitmap.Dispose()
}

Save-OgImage -Scale 1 -Path (Join-Path $root 'static\og.png')
Save-OgImage -Scale 2 -Path (Join-Path $root 'static\og@2x.png')

$fontCollection.Dispose()
