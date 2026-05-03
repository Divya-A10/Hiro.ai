import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { extractTextFromPdf } from '@/src/lib/pdf';

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a PDF file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  } as any);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    try {
      // 1. Extract text
      const text = await extractTextFromPdf(file);
      
      // 2. Upload to Supabase Storage (public bucket for MVP demo)
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // 3. Save reference in DB
      const { data: dbData, error: dbError } = await supabase
        .from('resumes')
        .insert({
          file_url: publicUrl,
          extracted_text: text,
          filename: file.name
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 4. Navigate to next step
      sessionStorage.setItem('current_resume_id', dbData.id);
      sessionStorage.setItem('current_resume_text', text);
      navigate('/job-description');

    } catch (err: any) {
      console.error('Upload error details:', err);
      let message = err.message || 'Failed to upload resume.';
      
      if (message === 'Failed to fetch') {
        message = 'Connection to Supabase failed. Please check if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly set in your environment variables.';
      }
      
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-light tracking-tighter text-white"
          >
            Upload your <span className="font-serif italic text-white/40">Resume</span>
          </motion.h1>
          <p className="text-zinc-500 text-lg">We only accept PDF formats for precise parsing.</p>
        </div>

        <div className="space-y-8">
          <div 
            {...getRootProps()} 
            className={`
              relative group cursor-pointer border-2 border-dashed rounded-[2rem] p-12 transition-all
              ${isDragActive ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'}
              ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center transition-all
                ${file ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-zinc-500'}
              `}>
                {file ? <CheckCircle className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
              </div>
              
              {file ? (
                <div>
                  <p className="text-white font-medium text-lg">{file.name}</p>
                  <p className="text-zinc-500 text-sm">Click or drag to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-white font-medium text-lg">
                    {isDragActive ? 'Drop your resume here' : 'Drop your resume or click to browse'}
                  </p>
                  <p className="text-zinc-500 text-sm">Maximium file size: 5MB</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`
                px-12 py-5 rounded-full text-xl font-medium transition-all flex items-center gap-4
                ${!file || isUploading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02]'}
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue
                  <FileText className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
