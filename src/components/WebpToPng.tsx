import { useState } from 'react';
import { Download, RefreshCw, Image as ImageIcon, Loader2 } from 'lucide-react';
import FileDropZone from './FileDropZone';

export default function WebpToPng() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setResultUrl(null);
    setPreviewUrl(null);
    setProcessing(false);
    setError('');
  };

  const handleFile = (next: File) => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(next);
    setResultUrl(null);
    setPreviewUrl(URL.createObjectURL(next));
    setError('');
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');

    try {
      const image = new Image();
      const sourceUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Could not read the WebP image.'));
        image.src = sourceUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Canvas is unavailable in this browser.');
      }

      context.drawImage(image, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((value) => {
          if (value) resolve(value);
          else reject(new Error('PNG export failed.'));
        }, 'image/png');
      });

      URL.revokeObjectURL(sourceUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropZone
        accept="image/webp"
        onFileSelect={handleFile}
        icon="image"
        label="Drop a WebP image to convert"
        hint="or click to browse. Output will download as PNG."
      />

      {file && (
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <ImageIcon className="h-4 w-4 text-brand-600" />
              Source file
            </div>
            <p className="mt-2 text-sm text-slate-500">{file.name}</p>
            <p className="text-sm text-slate-500">
              {(file.size / 1024).toFixed(1)} KB · WebP
            </p>

            <button
              type="button"
              onClick={convert}
              disabled={processing}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              {processing ? 'Converting...' : 'Convert WebP to PNG'}
            </button>

            {error && (
              <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
            )}
          </div>

          <div className="card p-5">
            <p className="text-sm font-medium text-slate-700">Preview</p>
            <div className="mt-3 flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
              {previewUrl ? (
                <img src={previewUrl} alt="WebP preview" className="max-h-52 w-auto rounded-xl object-contain" />
              ) : (
                <p className="text-center text-sm text-slate-500">Your WebP preview will appear here.</p>
              )}
            </div>

            {resultUrl && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href={resultUrl}
                  download={`${(file?.name || 'converted').replace(/\.webp$/i, '')}.png`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
