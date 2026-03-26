import { useState } from 'react';
import { Download, Loader2, RefreshCw, Film } from 'lucide-react';
import FileDropZone from './FileDropZone';
import ProgressBar from './ProgressBar';
import { getFFmpeg, fetchFile } from './ffmpeg-helpers';

export default function VideoToGif() {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState('00:00:00');
  const [duration, setDuration] = useState('5');
  const [fps, setFps] = useState('15');
  const [width, setWidth] = useState('480');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleConvert = async () => {
    if (!file) return;
    setStatus('loading');
    setProgress(0);
    setErrorMsg('');

    try {
      const ffmpeg = await getFFmpeg(setProgress);
      setStatus('processing');

      const ext = file.name.substring(file.name.lastIndexOf('.')) || '.mp4';
      const inputName = `input${ext}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec([
        '-i', inputName,
        '-ss', startTime,
        '-t', duration,
        '-vf', `fps=${fps},scale=${width}:-1:flags=lanczos`,
        '-gifflags', '+transdiff',
        'output.gif',
      ]);

      const data = await ffmpeg.readFile('output.gif');
      const blob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'GIF conversion failed');
      setStatus('error');
    }
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setResultUrl(null);
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <FileDropZone
          accept="video/*"
          onFileSelect={(f) => { setFile(f); setStatus('idle'); setResultUrl(null); }}
          label="Drop a video to convert to GIF"
          hint="Create animated GIFs from any video clip"
        />

        {file && status !== 'done' && (
          <div className="mt-8 space-y-6 border-t border-zinc-100 pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Start time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Duration (s)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                  max="30"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">FPS</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px] text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all shadow-sm"
                >
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1.5">Width (px)</label>
                <select
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px] text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all shadow-sm"
                >
                  <option value="320">320</option>
                  <option value="480">480</option>
                  <option value="640">640</option>
                  <option value="800">800</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleConvert}
              disabled={status === 'loading' || status === 'processing'}
              className="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[14px] font-semibold hover:bg-zinc-800 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(status === 'loading' || status === 'processing') ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
              {status === 'loading' ? 'Loading FFmpeg...' : status === 'processing' ? 'Creating GIF...' : 'Create GIF'}
            </button>
          </div>
        )}

        {(status === 'loading' || status === 'processing') && (
          <div className="mt-6">
            <ProgressBar progress={status === 'loading' ? 0 : progress} label={status === 'loading' ? 'Loading FFmpeg engine...' : 'Creating GIF...'} />
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] font-medium text-red-600 flex items-start gap-3">
            <svg xmlns="http://www.w0.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 mt-0.5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
            </svg>
            {errorMsg}
          </div>
        )}
      </div>

      {status === 'done' && resultUrl && (
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col items-center">
          <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-200/80 flex items-center justify-center relative p-4 bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%),linear-gradient(-45deg,#f4f4f5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f4f4f5_75%),linear-gradient(-45deg,transparent_75%,#f4f4f5_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]">
            <img src={resultUrl} alt="Generated GIF" className="rounded-lg max-h-80 relative z-10 shadow-sm" />
          </div>
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg xmlns="http://www.w0.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </span>
              <p className="text-[14px] font-semibold text-zinc-900">GIF created successfully!</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={reset} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-zinc-900 border border-zinc-200 rounded-xl text-[13px] font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm active:scale-[0.98]">
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
              <a
                href={resultUrl}
                download="video-output.gif"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[13px] font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98]"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
