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
      const blob = new Blob([data], { type: 'image/gif' });
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
    <div className="space-y-4">
      <FileDropZone
        accept="video/*"
        onFileSelect={(f) => { setFile(f); setStatus('idle'); setResultUrl(null); }}
        label="Drop a video to convert to GIF"
        hint="Create animated GIFs from any video clip"
      />

      {file && status !== 'done' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="30"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FPS</label>
              <select
                value={fps}
                onChange={(e) => setFps(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
              <select
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
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
            className="w-full px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {(status === 'loading' || status === 'processing') ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
            {status === 'loading' ? 'Loading FFmpeg...' : status === 'processing' ? 'Creating GIF...' : 'Create GIF'}
          </button>
        </>
      )}

      {(status === 'loading' || status === 'processing') && (
        <ProgressBar progress={status === 'loading' ? 0 : progress} label={status === 'loading' ? 'Loading FFmpeg engine...' : 'Creating GIF...'} />
      )}

      {status === 'error' && (
        <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">{errorMsg}</div>
      )}

      {status === 'done' && resultUrl && (
        <div className="space-y-3">
          <img src={resultUrl} alt="Generated GIF" className="rounded-lg max-h-64 mx-auto" />
          <div className="bg-green-50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-green-700 font-medium text-sm">GIF created!</p>
            <div className="flex gap-2">
              <a
                href={resultUrl}
                download="media-man-output.gif"
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download GIF
              </a>
              <button onClick={reset} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> New File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
