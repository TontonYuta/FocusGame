#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFilter

def create_base_canvas(size=1024, is_round=False, is_foreground=False):
    """
    Creates a high-resolution base canvas with FocusGame branding.
    If is_foreground is True, background is transparent and graphics are scaled to Android safe-zone (66%).
    """
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    center = size / 2

    if not is_foreground:
        # Background gradient & shape
        bg = Image.new('RGBA', (size, size), (7, 11, 20, 255)) # Dark space #070b14
        bg_draw = ImageDraw.Draw(bg)
        
        # Radial subtle ambient glow from center
        for r in range(int(size * 0.7), 0, -8):
            alpha = int(35 * (1 - r / (size * 0.7)))
            bbox = [center - r, center - r, center + r, center + r]
            bg_draw.ellipse(bbox, fill=(6, 182, 212, alpha)) # #06b6d4 glow

        # Secondary deep purple glow
        for r in range(int(size * 0.45), 0, -6):
            alpha = int(25 * (1 - r / (size * 0.45)))
            bbox = [center - r, center - r + 30, center + r, center + r + 30]
            bg_draw.ellipse(bbox, fill=(99, 102, 241, alpha)) # indigo glow

        if is_round:
            # Mask to circle
            mask = Image.new('L', (size, size), 0)
            mask_draw = ImageDraw.Draw(mask)
            mask_draw.ellipse([8, 8, size - 8, size - 8], fill=255)
            img.paste(bg, (0, 0), mask)
            # Subtle border
            draw = ImageDraw.Draw(img)
            draw.ellipse([8, 8, size - 8, size - 8], outline=(14, 165, 233, 140), width=6)
        else:
            # Squircle / Rounded Rect
            radius = int(size * 0.22)
            mask = Image.new('L', (size, size), 0)
            mask_draw = ImageDraw.Draw(mask)
            mask_draw.rounded_rectangle([4, 4, size - 4, size - 4], radius=radius, fill=255)
            img.paste(bg, (0, 0), mask)
            # Subtle border
            draw = ImageDraw.Draw(img)
            draw.rounded_rectangle([4, 4, size - 4, size - 4], radius=radius, outline=(14, 165, 233, 130), width=6)

    # Drawing vector elements
    # Scale factor: Foreground icons must be contained within ~65% safe zone
    scale = 0.62 if is_foreground else 0.88
    cx, cy = center, center

    overlay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    # 1. OUTER ORBIT RING
    r_outer = (size * 0.42) * scale
    bbox_outer = [cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer]
    
    # Outer Glow
    glow_outer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gd_outer = ImageDraw.Draw(glow_outer)
    gd_outer.ellipse(bbox_outer, outline=(6, 182, 212, 160), width=int(22 * scale))
    glow_outer = glow_outer.filter(ImageFilter.GaussianBlur(radius=int(14 * scale)))
    overlay = Image.alpha_composite(overlay, glow_outer)
    d = ImageDraw.Draw(overlay)

    # Outer Sharp Ring
    d.ellipse(bbox_outer, outline=(6, 182, 212, 240), width=int(12 * scale))

    # Outer Orbiting Nodes
    angle1 = math.radians(-35)
    nx1 = cx + r_outer * math.cos(angle1)
    ny1 = cy + r_outer * math.sin(angle1)
    nr1 = int(24 * scale)
    # Node 1 Glow
    d.ellipse([nx1 - nr1 * 1.8, ny1 - nr1 * 1.8, nx1 + nr1 * 1.8, ny1 + nr1 * 1.8], fill=(6, 182, 212, 90))
    d.ellipse([nx1 - nr1, ny1 - nr1, nx1 + nr1, ny1 + nr1], fill=(34, 211, 238, 255), outline=(255, 255, 255, 240), width=int(4 * scale))
    # Sparkle center
    d.ellipse([nx1 - nr1 * 0.35, ny1 - nr1 * 0.35, nx1 + nr1 * 0.35, ny1 + nr1 * 0.35], fill=(255, 255, 255, 255))

    angle2 = math.radians(145)
    nx2 = cx + r_outer * math.cos(angle2)
    ny2 = cy + r_outer * math.sin(angle2)
    nr2 = int(18 * scale)
    d.ellipse([nx2 - nr2 * 1.6, ny2 - nr2 * 1.6, nx2 + nr2 * 1.6, ny2 + nr2 * 1.6], fill=(99, 102, 241, 100))
    d.ellipse([nx2 - nr2, ny2 - nr2, nx2 + nr2, ny2 + nr2], fill=(129, 140, 248, 255), outline=(255, 255, 255, 220), width=int(3 * scale))

    # 2. INNER ORBIT RING
    r_inner = (size * 0.27) * scale
    bbox_inner = [cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner]
    
    # Inner Glow
    glow_inner = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gd_inner = ImageDraw.Draw(glow_inner)
    gd_inner.ellipse(bbox_inner, outline=(168, 85, 247, 140), width=int(18 * scale))
    glow_inner = glow_inner.filter(ImageFilter.GaussianBlur(radius=int(10 * scale)))
    overlay = Image.alpha_composite(overlay, glow_inner)
    d = ImageDraw.Draw(overlay)

    # Inner Sharp Ring (Indigo/Purple)
    d.ellipse(bbox_inner, outline=(168, 85, 247, 230), width=int(10 * scale))

    # Inner Node (Amber/Gold speed booster)
    angle_in = math.radians(70)
    inx = cx + r_inner * math.cos(angle_in)
    iny = cy + r_inner * math.sin(angle_in)
    in_r = int(20 * scale)
    d.ellipse([inx - in_r * 1.7, iny - in_r * 1.7, inx + in_r * 1.7, iny + in_r * 1.7], fill=(245, 158, 11, 110))
    d.ellipse([inx - in_r, iny - in_r, inx + in_r, iny + in_r], fill=(251, 191, 36, 255), outline=(255, 255, 255, 240), width=int(3 * scale))
    d.ellipse([inx - in_r * 0.35, iny - in_r * 0.35, inx + in_r * 0.35, iny + in_r * 0.35], fill=(255, 255, 255, 255))

    # 3. CENTRAL RADAR / LASER RETICLE (Crosshairs)
    tick_len = int(28 * scale)
    gap = (size * 0.15) * scale
    outer_tick = gap + tick_len
    # 4 directional crosshairs
    ch_color = (56, 189, 248, 220)
    ch_w = int(7 * scale)
    d.line([(cx, cy - outer_tick), (cx, cy - gap)], fill=ch_color, width=ch_w)
    d.line([(cx, cy + gap), (cx, cy + outer_tick)], fill=ch_color, width=ch_w)
    d.line([(cx - outer_tick, cy), (cx - gap, cy)], fill=ch_color, width=ch_w)
    d.line([(cx + gap, cy), (cx + outer_tick, cy)], fill=ch_color, width=ch_w)

    # 4. CENTRAL FOCUS CORE DIAMOND & "F" MOTIF
    core_r = (size * 0.12) * scale
    
    # Diamond Core Glow
    glow_core = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gd_core = ImageDraw.Draw(glow_core)
    diamond_glow_pts = [
        (cx, cy - core_r * 1.6),
        (cx + core_r * 1.6, cy),
        (cx, cy + core_r * 1.6),
        (cx - core_r * 1.6, cy)
    ]
    gd_core.polygon(diamond_glow_pts, fill=(6, 182, 212, 140))
    glow_core = glow_core.filter(ImageFilter.GaussianBlur(radius=int(18 * scale)))
    overlay = Image.alpha_composite(overlay, glow_core)
    d = ImageDraw.Draw(overlay)

    # Diamond Solid Core
    diamond_pts = [
        (cx, cy - core_r),
        (cx + core_r, cy),
        (cx, cy + core_r),
        (cx - core_r, cy)
    ]
    d.polygon(diamond_pts, fill=(15, 23, 42, 245), outline=(56, 189, 248, 255), width=int(6 * scale))

    # Center Precision Reticle Point
    d.ellipse([cx - 16 * scale, cy - 16 * scale, cx + 16 * scale, cy + 16 * scale], fill=(255, 255, 255, 255))
    d.ellipse([cx - 8 * scale, cy - 8 * scale, cx + 8 * scale, cy + 8 * scale], fill=(6, 182, 212, 255))

    # Composite overlay onto img
    final_img = Image.alpha_composite(img, overlay)
    return final_img

def generate_svg():
    """Generates pure crisp SVG favicon and vector logo"""
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <radialGradient id="spaceGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="60%" stop-color="#070b14" />
      <stop offset="100%" stop-color="#020408" />
    </radialGradient>
    <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <linearGradient id="innerOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="deepGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
  </defs>

  <!-- Squircle App Background -->
  <rect x="12" y="12" width="488" height="488" rx="112" fill="url(#spaceGrad)" stroke="#0ea5e9" stroke-width="3" stroke-opacity="0.4" />
  
  <!-- Subtle Center Ambient Glow -->
  <circle cx="256" cy="256" r="210" fill="url(#cyanGlow)" />

  <!-- Outer Orbit Glow & Ring -->
  <circle cx="256" cy="256" r="185" fill="none" stroke="#06b6d4" stroke-width="12" stroke-opacity="0.3" filter="url(#deepGlow)" />
  <circle cx="256" cy="256" r="185" fill="none" stroke="url(#orbitGrad)" stroke-width="7" stroke-dasharray="900" />

  <!-- Orbiting Node 1 (Cyan Photon) -->
  <g transform="rotate(-35 256 256)">
    <circle cx="441" cy="256" r="26" fill="#06b6d4" fill-opacity="0.4" filter="url(#deepGlow)" />
    <circle cx="441" cy="256" r="14" fill="#22d3ee" stroke="#ffffff" stroke-width="3" filter="url(#neonBlur)" />
    <circle cx="441" cy="256" r="5" fill="#ffffff" />
  </g>

  <!-- Orbiting Node 2 (Blue Satellite) -->
  <g transform="rotate(145 256 256)">
    <circle cx="441" cy="256" r="18" fill="#6366f1" fill-opacity="0.4" filter="url(#deepGlow)" />
    <circle cx="441" cy="256" r="10" fill="#818cf8" stroke="#ffffff" stroke-width="2.5" />
  </g>

  <!-- Inner Orbit Glow & Ring -->
  <circle cx="256" cy="256" r="118" fill="none" stroke="#a855f7" stroke-width="10" stroke-opacity="0.25" filter="url(#deepGlow)" />
  <circle cx="256" cy="256" r="118" fill="none" stroke="url(#innerOrbitGrad)" stroke-width="6" />

  <!-- Inner Node (Amber Speed Booster) -->
  <g transform="rotate(70 256 256)">
    <circle cx="374" cy="256" r="22" fill="#f59e0b" fill-opacity="0.4" filter="url(#deepGlow)" />
    <circle cx="374" cy="256" r="12" fill="#fbbf24" stroke="#ffffff" stroke-width="2.5" filter="url(#neonBlur)" />
    <circle cx="374" cy="256" r="4" fill="#ffffff" />
  </g>

  <!-- Central Reticle Crosshairs (Radar Ticks) -->
  <line x1="256" y1="184" x2="256" y2="164" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
  <line x1="256" y1="328" x2="256" y2="348" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
  <line x1="184" y1="256" x2="164" y2="256" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
  <line x1="328" y1="256" x2="348" y2="256" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />

  <!-- Central Laser Diamond Core -->
  <g filter="url(#neonBlur)">
    <polygon points="256,204 308,256 256,308 204,256" fill="#0f172a" stroke="#38bdf8" stroke-width="4.5" />
    <polygon points="256,218 294,256 256,294 218,256" fill="#0369a1" fill-opacity="0.4" />
  </g>

  <!-- Reticle Precision Dot -->
  <circle cx="256" cy="256" r="10" fill="#ffffff" filter="url(#neonBlur)" />
  <circle cx="256" cy="256" r="5" fill="#06b6d4" />
</svg>
'''
    return svg_content

def main():
    base_dir = '/home/tontonyuta/FocusGame'
    public_dir = os.path.join(base_dir, 'public')
    android_res = os.path.join(base_dir, 'android/app/src/main/res')
    os.makedirs(public_dir, exist_ok=True)

    print("Generating pure SVG favicon...")
    svg_path = os.path.join(public_dir, 'favicon.svg')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(generate_svg())
    print(f"✓ Saved {svg_path}")

    print("Rendering high-res base icons (1024x1024)...")
    icon_squircle = create_base_canvas(1024, is_round=False, is_foreground=False)
    icon_round = create_base_canvas(1024, is_round=True, is_foreground=False)
    icon_foreground = create_base_canvas(1024, is_round=False, is_foreground=True)

    # 1. Web Public Icons
    print("Generating Web PWA & Favicon assets...")
    icon_squircle.resize((512, 512), Image.LANCZOS).save(os.path.join(public_dir, 'icon-512.png'), 'PNG')
    icon_squircle.resize((192, 192), Image.LANCZOS).save(os.path.join(public_dir, 'icon-192.png'), 'PNG')
    icon_squircle.resize((180, 180), Image.LANCZOS).save(os.path.join(public_dir, 'apple-touch-icon.png'), 'PNG')
    icon_squircle.resize((64, 64), Image.LANCZOS).save(os.path.join(public_dir, 'favicon.png'), 'PNG')
    
    # Save .ico for legacy browsers
    icon_squircle.resize((48, 48), Image.LANCZOS).save(os.path.join(public_dir, 'favicon.ico'), format='ICO')
    print("✓ Web icons created in public/")

    # 2. Android Mipmap Icons
    print("Generating Android Launcher Adaptive & Round Icons...")
    android_specs = {
        'mipmap-mdpi': {'main': 48, 'round': 48, 'fg': 108},
        'mipmap-hdpi': {'main': 72, 'round': 72, 'fg': 162},
        'mipmap-xhdpi': {'main': 96, 'round': 96, 'fg': 216},
        'mipmap-xxhdpi': {'main': 144, 'round': 144, 'fg': 324},
        'mipmap-xxxhdpi': {'main': 192, 'round': 192, 'fg': 432},
    }

    for folder, sizes in android_specs.items():
        target_dir = os.path.join(android_res, folder)
        os.makedirs(target_dir, exist_ok=True)

        # Standard squircle launcher
        p_main = os.path.join(target_dir, 'ic_launcher.png')
        icon_squircle.resize((sizes['main'], sizes['main']), Image.LANCZOS).save(p_main, 'PNG')

        # Round launcher
        p_round = os.path.join(target_dir, 'ic_launcher_round.png')
        icon_round.resize((sizes['round'], sizes['round']), Image.LANCZOS).save(p_round, 'PNG')

        # Adaptive foreground
        p_fg = os.path.join(target_dir, 'ic_launcher_foreground.png')
        icon_foreground.resize((sizes['fg'], sizes['fg']), Image.LANCZOS).save(p_fg, 'PNG')

        print(f"✓ {folder}: {sizes['main']}px, round {sizes['round']}px, fg {sizes['fg']}px")

    # Update ic_launcher_background.xml
    bg_xml_path = os.path.join(android_res, 'values/ic_launcher_background.xml')
    with open(bg_xml_path, 'w', encoding='utf-8') as f:
        f.write('''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#070b14</color>
</resources>
''')
    print("✓ Updated ic_launcher_background.xml to #070b14")

if __name__ == '__main__':
    main()
