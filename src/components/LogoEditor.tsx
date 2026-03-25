import { useState, useRef, useCallback, useEffect } from 'react';

// --- Data: Style Presets ---
const STYLE_PRESETS = [
  { id: 'modern', name: 'Modern', fontFamily: 'Inter', fontWeight: 700, letterSpacing: 2, iconScale: 1.0, textTransform: 'uppercase' as const },
  { id: 'minimalist', name: 'Minimalist', fontFamily: 'Raleway', fontWeight: 700, letterSpacing: 4, iconScale: 0.8, textTransform: 'uppercase' as const },
  { id: 'bold', name: 'Bold', fontFamily: 'Montserrat', fontWeight: 800, letterSpacing: 1, iconScale: 1.2, textTransform: 'uppercase' as const },
  { id: 'playful', name: 'Playful', fontFamily: 'Pacifico', fontWeight: 400, letterSpacing: 0, iconScale: 1.1, textTransform: 'none' as const },
  { id: 'corporate', name: 'Corporate', fontFamily: 'Playfair Display', fontWeight: 700, letterSpacing: 1, iconScale: 0.9, textTransform: 'none' as const },
  { id: 'tech', name: 'Tech', fontFamily: 'Space Mono', fontWeight: 700, letterSpacing: 3, iconScale: 1.0, textTransform: 'uppercase' as const },
];

// --- Data: Color Palettes ---
const COLOR_PALETTES = [
  { id: 'blue', name: 'Ocean Blue', primary: '#2563eb', secondary: '#1e40af', accent: '#60a5fa', bg: '#eff6ff' },
  { id: 'emerald', name: 'Emerald', primary: '#059669', secondary: '#047857', accent: '#34d399', bg: '#ecfdf5' },
  { id: 'violet', name: 'Violet', primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa', bg: '#f5f3ff' },
  { id: 'rose', name: 'Rose', primary: '#e11d48', secondary: '#be123c', accent: '#fb7185', bg: '#fff1f2' },
  { id: 'amber', name: 'Amber', primary: '#d97706', secondary: '#b45309', accent: '#fbbf24', bg: '#fffbeb' },
  { id: 'slate', name: 'Slate', primary: '#334155', secondary: '#1e293b', accent: '#64748b', bg: '#f8fafc' },
  { id: 'teal', name: 'Teal', primary: '#0d9488', secondary: '#0f766e', accent: '#2dd4bf', bg: '#f0fdfa' },
  { id: 'orange', name: 'Sunset', primary: '#ea580c', secondary: '#c2410c', accent: '#fb923c', bg: '#fff7ed' },
  { id: 'black', name: 'Monochrome', primary: '#18181b', secondary: '#09090b', accent: '#71717a', bg: '#fafafa' },
  { id: 'coral', name: 'Coral', primary: '#f43f5e', secondary: '#e11d48', accent: '#fda4af', bg: '#fff1f2' },
];

// --- Data: Font Options ---
const FONTS = [
  'Inter', 'Montserrat', 'Playfair Display', 'Space Mono',
  'Poppins', 'Raleway', 'Oswald', 'Pacifico',
];

// --- Data: SVG Icons ---
const ICONS: Record<string, { name: string; path: string }> = {
  none: { name: 'No Icon', path: '' },
  bolt: { name: 'Bolt', path: 'M13 2L3 14h9l-1 12 10-12h-9l1-12z' },
  star: { name: 'Star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z' },
  heart: { name: 'Heart', path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z' },
  globe: { name: 'Globe', path: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 016.32 3.1A12.94 12.94 0 0012 6a12.94 12.94 0 00-6.32 1.1A8 8 0 0112 4zm0 16a8 8 0 01-6.32-3.1A12.94 12.94 0 0012 18a12.94 12.94 0 006.32-1.1A8 8 0 0112 20z' },
  diamond: { name: 'Diamond', path: 'M12 2L2 12l10 10 10-10L12 2z' },
  shield: { name: 'Shield', path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  hexagon: { name: 'Hexagon', path: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
  circle: { name: 'Circle', path: 'M12 2a10 10 0 100 20 10 10 0 000-20z' },
  coffee: { name: 'Coffee', path: 'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zm2-6h12v2H4V2z' },
  code: { name: 'Code', path: 'M16 18l6-6-6-6M8 6l-6 6 6 6' },
  music: { name: 'Music', path: 'M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z' },
  camera: { name: 'Camera', path: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11zM12 17a4 4 0 100-8 4 4 0 000 8z' },
  book: { name: 'Book', path: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z' },
  leaf: { name: 'Leaf', path: 'M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75' },
  rocket: { name: 'Rocket', path: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3m3 3a22 22 0 005.37-9.12 1.09 1.09 0 00-.25-1 1.09 1.09 0 00-1-.25A22 22 0 009 12m3 3l-3-3m0 0l-2.16 2.16m5.16.84l2.16-2.16' },
  crown: { name: 'Crown', path: 'M2 20h20L18 8l-4 6-2-8-2 8-4-6-4 12z' },
  flame: { name: 'Flame', path: 'M12 22c4-2 8-6 8-12a8 8 0 00-16 0c0 6 4 10 8 12zm0-6a3 3 0 100-6 3 3 0 000 6z' },
  mountain: { name: 'Mountain', path: 'M8 3l4 8 5-5 7 14H0L8 3z' },
  sun: { name: 'Sun', path: 'M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 8a4 4 0 100 8 4 4 0 000-8z' },
  zap: { name: 'Zap', path: 'M13 2L3 14h9l-1 12 10-12h-9l1-12z' },
};

// --- Data: Layouts ---
type LayoutType = 'icon-above' | 'icon-left' | 'text-only' | 'icon-only';
const LAYOUTS: { id: LayoutType; name: string }[] = [
  { id: 'icon-above', name: 'Icon Above' },
  { id: 'icon-left', name: 'Icon Left' },
  { id: 'text-only', name: 'Text Only' },
  { id: 'icon-only', name: 'Icon Only' },
];

export default function LogoEditor() {
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [style, setStyle] = useState(STYLE_PRESETS[0]);
  const [palette, setPalette] = useState(COLOR_PALETTES[0]);
  const [font, setFont] = useState(FONTS[0]);
  const [icon, setIcon] = useState('none');
  const [layout, setLayout] = useState<LayoutType>('icon-above');
  const [transparentBg, setTransparentBg] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const displayName = brandName || 'Your Brand';
  const currentStyle = style;

  const drawLogo = useCallback((ctx: CanvasRenderingContext2D, size: number, forExport = false) => {
    const scale = size / 400;
    ctx.clearRect(0, 0, size, size);

    if (!transparentBg || !forExport) {
      ctx.fillStyle = forExport && transparentBg ? 'transparent' : palette.bg;
      ctx.fillRect(0, 0, size, size);
    }

    const centerX = size / 2;
    const centerY = size / 2;
    const iconSize = 80 * scale * currentStyle.iconScale;
    const selectedIcon = ICONS[icon];
    const hasIcon = icon !== 'none' && selectedIcon?.path;
    const showIcon = hasIcon && layout !== 'text-only';
    const showText = layout !== 'icon-only';

    if (layout === 'icon-above') {
      let iconY = showText ? centerY - 60 * scale : centerY;
      let textY = showIcon ? centerY + 30 * scale : centerY;

      if (showIcon && selectedIcon) {
        drawIcon(ctx, centerX, iconY, iconSize, selectedIcon.path, palette.primary);
      }
      if (showText) {
        drawText(ctx, centerX, textY, displayName, tagline, scale);
      }
    } else if (layout === 'icon-left') {
      let iconX = showText ? centerX - 100 * scale : centerX;
      let textX = showIcon ? centerX + 20 * scale : centerX;

      if (showIcon && selectedIcon) {
        drawIcon(ctx, iconX, centerY - 10 * scale, iconSize, selectedIcon.path, palette.primary);
      }
      if (showText) {
        drawTextLeft(ctx, textX, centerY, displayName, tagline, scale);
      }
    } else if (layout === 'text-only') {
      drawText(ctx, centerX, centerY, displayName, tagline, scale);
    } else if (layout === 'icon-only' && showIcon && selectedIcon) {
      drawIcon(ctx, centerX, centerY, iconSize * 1.5, selectedIcon.path, palette.primary);
    }
  }, [brandName, tagline, style, palette, font, icon, layout, transparentBg, displayName, currentStyle]);

  function drawIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, pathData: string, color: string) {
    ctx.save();
    const iconScale = size / 24;
    ctx.translate(x - (12 * iconScale), y - (12 * iconScale));
    ctx.scale(iconScale, iconScale);
    const path = new Path2D(pathData);
    ctx.fillStyle = color;
    ctx.fill(path);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke(path);
    ctx.restore();
  }

  function drawText(ctx: CanvasRenderingContext2D, x: number, y: number, name: string, sub: string, scale: number) {
    const fontSize = Math.min(48 * scale, (350 * scale) / (name.length * 0.6));
    const displayText = currentStyle.textTransform === 'uppercase' ? name.toUpperCase() : name;

    ctx.fillStyle = palette.primary;
    ctx.font = `${currentStyle.fontWeight} ${fontSize}px '${font}', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (currentStyle.letterSpacing) {
      ctx.letterSpacing = `${currentStyle.letterSpacing * scale}px`;
    }
    ctx.fillText(displayText, x, y);
    ctx.letterSpacing = '0px';

    if (sub) {
      const subSize = fontSize * 0.35;
      ctx.fillStyle = palette.accent;
      ctx.font = `400 ${subSize}px '${font}', sans-serif`;
      ctx.fillText(sub, x, y + fontSize * 0.65);
    }
  }

  function drawTextLeft(ctx: CanvasRenderingContext2D, x: number, y: number, name: string, sub: string, scale: number) {
    const fontSize = Math.min(40 * scale, (250 * scale) / (name.length * 0.6));
    const displayText = currentStyle.textTransform === 'uppercase' ? name.toUpperCase() : name;

    ctx.fillStyle = palette.primary;
    ctx.font = `${currentStyle.fontWeight} ${fontSize}px '${font}', sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    if (currentStyle.letterSpacing) {
      ctx.letterSpacing = `${currentStyle.letterSpacing * scale}px`;
    }
    ctx.fillText(displayText, x, y - (sub ? 12 * scale : 0));
    ctx.letterSpacing = '0px';

    if (sub) {
      const subSize = fontSize * 0.4;
      ctx.fillStyle = palette.accent;
      ctx.font = `400 ${subSize}px '${font}', sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(sub, x, y + fontSize * 0.5);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 400;
    canvas.height = 400;
    drawLogo(ctx, 400);
  }, [drawLogo]);

  const downloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawLogo(ctx, 1024, true);
    const link = document.createElement('a');
    link.download = `${(brandName || 'logo').toLowerCase().replace(/\s+/g, '-')}-logo.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadSVG = () => {
    const size = 400;
    const selectedIcon = ICONS[icon];
    const hasIcon = icon !== 'none' && selectedIcon?.path;
    const showIcon = hasIcon && layout !== 'text-only';
    const showText = layout !== 'icon-only';
    const dName = currentStyle.textTransform === 'uppercase' ? displayName.toUpperCase() : displayName;
    const fontSize = Math.min(48, 350 / (displayName.length * 0.6));

    let iconSvg = '';
    let textSvg = '';
    const centerX = size / 2;
    const centerY = size / 2;
    const iconSize = 80 * currentStyle.iconScale;

    if (showIcon && selectedIcon) {
      const iScale = iconSize / 24;
      let ix = centerX;
      let iy = layout === 'icon-above' ? (showText ? centerY - 60 : centerY) : centerY - 10;
      if (layout === 'icon-left') ix = showText ? centerX - 100 : centerX;
      if (layout === 'icon-only') { iy = centerY; }
      const tx = ix - 12 * iScale;
      const ty = iy - 12 * iScale;
      iconSvg = `<g transform="translate(${tx},${ty}) scale(${iScale})"><path d="${selectedIcon.path}" fill="${palette.primary}" stroke="${palette.primary}" stroke-width="1.5"/></g>`;
    }

    if (showText) {
      let tx = centerX;
      let ty = layout === 'icon-above' ? (showIcon ? centerY + 30 : centerY) : centerY;
      const anchor = layout === 'icon-left' ? 'start' : 'middle';
      if (layout === 'icon-left') tx = showIcon ? centerX + 20 : centerX;
      textSvg = `<text x="${tx}" y="${ty}" fill="${palette.primary}" font-family="'${font}', sans-serif" font-size="${fontSize}" font-weight="${currentStyle.fontWeight}" text-anchor="${anchor}" dominant-baseline="middle" letter-spacing="${currentStyle.letterSpacing}">${escapeXml(dName)}</text>`;
      if (tagline) {
        const subSize = fontSize * 0.35;
        const subY = ty + fontSize * 0.65;
        textSvg += `<text x="${tx}" y="${subY}" fill="${palette.accent}" font-family="'${font}', sans-serif" font-size="${subSize}" font-weight="400" text-anchor="${anchor}" dominant-baseline="middle">${escapeXml(tagline)}</text>`;
      }
    }

    const bgRect = transparentBg ? '' : `<rect width="${size}" height="${size}" fill="${palette.bg}"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bgRect}${iconSvg}${textSvg}</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `${(brandName || 'logo').toLowerCase().replace(/\s+/g, '-')}-logo.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  function escapeXml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls Panel */}
      <div className="space-y-6 order-2 lg:order-1">
        {/* Brand Name */}
        <div>
          <label htmlFor="brand-name" className="block text-sm font-semibold text-gray-700 mb-1.5">Brand Name</label>
          <input
            id="brand-name"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Your Brand"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
            maxLength={30}
          />
        </div>

        {/* Tagline */}
        <div>
          <label htmlFor="tagline" className="block text-sm font-semibold text-gray-700 mb-1.5">Tagline <span className="font-normal text-gray-500">(optional)</span></label>
          <input
            id="tagline"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Your tagline here"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
            maxLength={50}
          />
        </div>

        {/* Style Presets */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Style</label>
          <div className="grid grid-cols-3 gap-2">
            {STYLE_PRESETS.map((s) => (
              <button
                key={s.id}
                onClick={() => { setStyle(s); setFont(s.fontFamily); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  style.id === s.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Color Palette</label>
          <div className="grid grid-cols-5 gap-2">
            {COLOR_PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPalette(p)}
                className={`group relative h-10 rounded-lg border-2 transition-all ${
                  palette.id === p.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                }`}
                style={{ background: `linear-gradient(135deg, ${p.primary} 50%, ${p.accent} 50%)` }}
                title={p.name}
                aria-label={`Select ${p.name} palette`}
              />
            ))}
          </div>
        </div>

        {/* Font */}
        <div>
          <label htmlFor="font-select" className="block text-sm font-semibold text-gray-700 mb-1.5">Font</label>
          <select
            id="font-select"
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white text-gray-900"
          >
            {FONTS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
            ))}
          </select>
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Icon</label>
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 max-h-48 overflow-y-auto p-1">
            {Object.entries(ICONS).map(([key, ico]) => (
              <button
                key={key}
                onClick={() => setIcon(key)}
                className={`flex items-center justify-center h-10 w-full rounded-lg border transition-all ${
                  icon === key
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
                title={ico.name}
                aria-label={key === 'none' ? 'No icon' : `Select ${ico.name} icon`}
              >
                {key === 'none' ? (
                  <span className="text-xs" aria-hidden="true">None</span>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ico.path} />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Layout</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLayout(l.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  layout === l.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {/* Transparent BG */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="transparent-bg"
            checked={transparentBg}
            onChange={(e) => setTransparentBg(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="transparent-bg" className="text-sm text-gray-700">Transparent background</label>
        </div>
      </div>

      {/* Preview + Download Panel */}
      <div className="order-1 lg:order-2">
        <div className="sticky top-24">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Preview</span>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full h-full"
                style={{ imageRendering: 'auto' }}
              />
            </div>
          </div>

          {/* Download Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={downloadPNG}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              PNG
            </button>
            <button
              onClick={downloadSVG}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              SVG
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">1024×1024px · No watermark · Free forever</p>
        </div>
      </div>
    </div>
  );
}
