import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDropzone } from 'react-dropzone';
import { motion } from 'motion/react';
import { Check, Upload, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { extractTextFromPdf } from '../lib/pdf';
import { supabase } from '../lib/supabase';

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleContinue = async () => {
    if (file) {
      setLoading(true);
      setError(null);
      try {
        const text = await extractTextFromPdf(file);
        const uniqueName = `${Date.now()}-${file.name}`;
        
        let resumeId = `local-${Date.now()}`;
        try {
          const { error: uploadErr } = await supabase.storage
            .from("resumes")
            .upload(uniqueName, file);
          
          if (!uploadErr) {
            const { data: { publicUrl } } = supabase.storage
              .from("resumes")
              .getPublicUrl(uniqueName);

            const { data: insertedResume, error: dbErr } = await supabase
              .from("resumes")
              .insert({
                file_url: publicUrl,
                extracted_text: text,
                filename: file.name,
                user_id: user?.id || null,
              })
              .select()
              .single();

            if (!dbErr && insertedResume) {
              resumeId = insertedResume.id;
            }
          }
        } catch (supabaseError) {
          console.warn("Supabase backup connection skipped, proceeding locally:", supabaseError);
        }

        sessionStorage.setItem("current_resume_id", resumeId);
        sessionStorage.setItem("current_resume_text", text);
        navigate("/job-description");
      } catch (err: any) {
        console.error("Parsing error details:", err);
        setError(err.message || "Failed to process resume. Ensure it is a valid PDF format.");
      } finally {
        setLoading(false);
      }
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
              ${isDragActive ? "border-white bg-white/5" : "border-white/10 hover:border-white/30"}
              ${file ? "border-emerald-500/50 bg-emerald-500/5" : ""}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center transition-all
                  ${file ? "bg-emerald-500 text-white" : "bg-zinc-900 text-zinc-500"}
                `}
              >
                {file ? <Check className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
              </div>
              {file ? (
                <div>
                  <p className="text-white font-medium text-lg">{file.name}</p>
                  <p className="text-zinc-500 text-sm">Click or drag to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-white font-medium text-lg">
                    {isDragActive ? "Drop your resume here" : "Drop your resume or click to browse"}
                  </p>
                  <p className="text-zinc-500 text-sm">Maximum file size: 5MB</p>
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
              onClick={handleContinue}
              disabled={!file || loading}
              className={`
                px-12 py-5 rounded-full text-xl font-medium transition-all flex items-center gap-4
                ${!file || loading ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:scale-[1.02]"}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
