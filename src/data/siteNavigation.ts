export interface ToolLink {
  href: string;
  title: string;
  description: string;
  tag: string;
  cta: string;
}

export interface CategoryLink {
  id: string;
  href: string;
  label: string;
  summary: string;
  eyebrow: string;
  tools: ToolLink[];
}

export const primaryLinks = [
  {
    href: '/',
    label: 'Home',
    summary: 'Start with the site overview and category entry points.',
  },
  {
    href: '/#all-tools',
    label: 'All Tools',
    summary: 'Jump to the cross-category tool directory on the homepage.',
  },
];

export const categories: CategoryLink[] = [
  {
    id: 'dev-tools',
    href: '/dev-tools/',
    label: 'Dev Tools',
    summary: 'JSON, regex, text, and SQL helpers.',
    eyebrow: 'Developer workflows',
    tools: [
      {
        href: '/dev-tools/json-convertor/',
        title: 'JSON Convertor',
        description: 'Format, validate, infer TypeScript, convert curl commands, and inspect JWT payloads.',
        tag: 'API debugging',
        cta: 'Open JSON Convertor',
      },
      {
        href: '/dev-tools/text-formatter/',
        title: 'Text Formatter',
        description: 'Clean text, convert case, encode values, remove duplicates, and count words.',
        tag: 'Text operations',
        cta: 'Open Text Formatter',
      },
      {
        href: '/dev-tools/modern-devbox/',
        title: 'Modern DevBox',
        description: 'Use regex testing, Base64 helpers, cron building, and SQL formatting in one browser route.',
        tag: 'Micro dev tools',
        cta: 'Open Modern DevBox',
      },
    ],
  },
  {
    id: 'media-tools',
    href: '/media-tools/',
    label: 'Media Tools',
    summary: 'Images, GIFs, conversion, and logo basics.',
    eyebrow: 'Creator assets',
    tools: [
      {
        href: '/media-tools/image-optimizer/',
        title: 'Image Optimizer',
        description: 'Compress, resize, and reformat images in bulk without sending files to a server.',
        tag: 'Image compression',
        cta: 'Open Image Optimizer',
      },
      {
        href: '/media-tools/webp-to-png/',
        title: 'WebP to PNG',
        description: 'Convert a WebP asset into PNG instantly in your browser with one narrow workflow.',
        tag: 'Format conversion',
        cta: 'Open WebP to PNG',
      },
      {
        href: '/media-tools/video-to-gif/',
        title: 'Video to GIF',
        description: 'Turn a short clip into a shareable GIF using FFmpeg.wasm in the browser.',
        tag: 'Creator workflow',
        cta: 'Open Video to GIF',
      },
      {
        href: '/media-tools/logo-generator/',
        title: 'Logo Generator',
        description: 'Create a fast logo concept with export-ready PNG and SVG output.',
        tag: 'Brand assets',
        cta: 'Open Logo Generator',
      },
    ],
  },
  {
    id: 'creator-tools',
    href: '/creator-tools/',
    label: 'Creator Tools',
    summary: 'Previews, drafts, rewrites, and prompts.',
    eyebrow: 'Publishing systems',
    tools: [
      {
        href: '/creator-tools/social-profiler/',
        title: 'Social Profiler',
        description: 'Preview Google, X, Facebook, and LinkedIn cards before publishing.',
        tag: 'Metadata QA',
        cta: 'Open Social Profiler',
      },
      {
        href: '/creator-tools/xhunter/',
        title: 'XHunter',
        description: 'Draft threads, reuse post templates, and build smarter replies for X.',
        tag: 'Creator workflow',
        cta: 'Open XHunter',
      },
      {
        href: '/creator-tools/writetune/',
        title: 'Writetune',
        description: 'Humanize AI text with tone controls and browser-side rewriting.',
        tag: 'AI writing',
        cta: 'Open Writetune',
      },
      {
        href: '/creator-tools/prompt-refiner/',
        title: 'Prompt Refiner',
        description: 'Turn a rough idea into a structured system prompt in Chinese or English.',
        tag: 'Prompt tools',
        cta: 'Open Prompt Refiner',
      },
    ],
  },
  {
    id: 'document-tools',
    href: '/document-tools/',
    label: 'Document Tools',
    summary: 'PDF merge, split, compress, and convert.',
    eyebrow: 'Private file tasks',
    tools: [
      {
        href: '/document-tools/pdf-easier/',
        title: 'PDF Easier',
        description: 'Handle merge, compress, split, rotate, and image conversion workflows in the browser.',
        tag: 'PDF workflows',
        cta: 'Open PDF Easier',
      },
    ],
  },
];

export const featuredLinks = [
  {
    href: '/dev-tools/json-convertor/',
    label: 'JSON Convertor',
    summary: 'API payload cleanup and format conversion.',
  },
  {
    href: '/media-tools/image-optimizer/',
    label: 'Image Optimizer',
    summary: 'Compress and resize images in the browser.',
  },
  {
    href: '/creator-tools/social-profiler/',
    label: 'Social Profiler',
    summary: 'Preview metadata before publishing.',
  },
  {
    href: '/document-tools/pdf-easier/',
    label: 'PDF Easier',
    summary: 'Private PDF merge, split, and compress workflows.',
  },
];

export const trustLinks = [
  {
    href: '/about/',
    label: 'About',
  },
  {
    href: '/privacy/',
    label: 'Privacy',
  },
  {
    href: '/contact/',
    label: 'Contact',
  },
];

export const allTools = categories.reduce<Array<ToolLink & { categoryId: string; categoryLabel: string; categoryHref: string }>>(
  (items, category) => {
    category.tools.forEach((tool) => {
      items.push({
        ...tool,
        categoryId: category.id,
        categoryLabel: category.label,
        categoryHref: category.href,
      });
    });

    return items;
  },
  [],
);
