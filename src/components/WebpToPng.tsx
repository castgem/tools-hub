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
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <FileDropZone
          accept="image/webp"
          onFileSelect={handleFile}
          icon="image"
          label="Drop a WebP image to convert"
          hint="or click to browse. Output will download as PNG."
        />

        {file && (
          <div className="mt-8 pt-8 border-t border-zinc-100 grid gap-6 md:grid-cols-[1fr_1.5fr]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
                  <ImageIcon className="h-3.5 w-3.5" />
                </span>
                Source file
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-[13px] font-medium text-zinc-900 truncate mb-1" title={file.name}>{file.name}</p>
                <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-zinc-200">WebP</span>
                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>

              <button
                type="button"
                onClick={convert}
                disabled={processing}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] shadow-sm"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                {processing ? 'Converting...' : 'Convert to PNG'}
              </button>

              {error && (
                <div className="mt-2 rounded-lg bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600 border border-red-100 flex items-start gap-2">
                  <svg xmlns="http://www.w0.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-900">Preview</span>
              </div>
              <div className="flex-1 flex min-h-[260px] items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%),linear-gradient(-45deg,#f4f4f5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f4f4f5_75%),linear-gradient(-45deg,transparent_75%,#f4f4f5_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] opacity-40 z-0"></div>
                {previewUrl ? (
                  <img src={previewUrl} alt="WebP preview" className="max-h-64 w-auto rounded-lg object-contain relative z-10 shadow-sm border border-zinc-200/50 bg-white" />
                ) : (
                  <p className="text-center text-[13px] text-zinc-400 relative z-10">Your WebP preview will appear here.</p>
                )}
              </div>

              {resultUrl && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={resultUrl}
                    download={`${(file?.name || 'converted').replace(/\.webp$/i, '')}.png`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-emerald-700 transition-all shadow-sm active:scale-[0.98]"
                  >
                    <Download className="h-4 w-4" />
                    Download PNG
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className="sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[14px] font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
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
    </div>
  );
}
