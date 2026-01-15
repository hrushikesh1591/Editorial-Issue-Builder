
import React, { useRef, useState } from 'react';

declare const XLSX: any;

interface FileUploaderProps {
  onDataLoaded: (data: any[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (data: any[]) => {
    if (!data || data.length === 0) {
      setError("The uploaded file appears to be empty.");
      return;
    }

    const firstRow = data[0];
    const availableCols = Object.keys(firstRow).map(k => k.trim().toLowerCase());
    
    // Define expected columns and their flexible matchers
    const requiredCols = [
      { key: 'Author_family_name', match: 'author_family_name' },
      { key: 'article_title', match: 'article_title' },
      { key: 'doi', match: 'doi' }
    ];

    const missing = requiredCols.filter(col => !availableCols.includes(col.match));

    if (missing.length > 0) {
      setError(`Missing required columns: ${missing.map(m => m.key).join(', ')}. Please check your file headers.`);
      return;
    }

    // If we reach here, normalize the keys to what the app expects
    const normalizedData = data.map(row => {
      const newRow: any = {};
      Object.keys(row).forEach(key => {
        const trimmedKey = key.trim();
        const lowerKey = trimmedKey.toLowerCase();
        
        // Map specific keys if they were found in different casing
        if (lowerKey === 'author_family_name') newRow['Author_family_name'] = row[key];
        else if (lowerKey === 'author_given_name') newRow['author_given_name'] = row[key];
        else if (lowerKey === 'article_title') newRow['article_title'] = row[key];
        else if (lowerKey === 'received') newRow['received'] = row[key];
        else if (lowerKey === 'accepted') newRow['accepted'] = row[key];
        else if (lowerKey === 'article_last_page') newRow['article_last_page'] = row[key];
        else if (lowerKey === 'editorial_ms_number') newRow['editorial_ms_number'] = row[key];
        else if (lowerKey === 'doi') newRow['doi'] = row[key];
        else if (lowerKey === 'rubric') newRow['rubric'] = row[key];
        else if (lowerKey === 'production_state') newRow['production_state'] = row[key];
        else if (lowerKey === 'online_first_date') newRow['online_first_date'] = row[key];
        else if (lowerKey === 'notes_on_issue_building') newRow['notes_on_issue_building'] = row[key];
        else if (lowerKey === 'note_for_pe') newRow['note_for_pe'] = row[key];
        else newRow[trimmedKey] = row[key];
      });
      return newRow;
    });

    onDataLoaded(normalizedData);
  };

  const handleFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames.length) {
          setError("No sheets found in the Excel file.");
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
        validateAndProcess(jsonData);
      } catch (err) {
        console.error("File processing error:", err);
        setError("Could not parse the Excel file. Ensure it is a valid .xlsx or .xls file.");
      }
    };

    reader.onerror = () => {
      setError("File reading failed. Please try again.");
    };

    reader.readAsArrayBuffer(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      handleFile(file);
    } else {
      setError("Please drop a valid Excel file (.xlsx or .xls)");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      <div 
        className={`w-full p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
          isDragging ? 'border-slate-900 bg-slate-100 scale-105' : 'border-slate-300 bg-white shadow-sm'
        } ${error ? 'border-red-300 bg-red-50' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <div className={`p-4 rounded-full mb-6 ${error ? 'bg-red-100' : 'bg-slate-100'}`}>
          <i className={`fas ${error ? 'fa-exclamation-circle text-red-500' : 'fa-cloud-upload-alt text-slate-400'} text-4xl`}></i>
        </div>
        
        <h2 className="text-xl font-bold mb-2">Upload Manuscript Manifest</h2>
        <p className="text-slate-500 text-center mb-8 px-4">
          Drag and drop your journal's .xlsx file here, or click to browse.
          <br />
          <span className="text-xs italic">Required headers: Author_family_name, article_title, doi</span>
        </p>

        {error && (
          <div className="mb-6 p-4 bg-white border border-red-200 rounded-lg text-red-600 text-xs font-medium max-w-sm text-center animate-in fade-in slide-in-from-top-1">
            <i className="fas fa-times-circle mr-2"></i>
            {error}
          </div>
        )}

        <button 
          onClick={() => fileInputRef.current?.click()}
          className={`${error ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'} text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md active:transform active:scale-95`}
        >
          {error ? 'Try Another File' : 'Choose File'}
        </button>

        <input 
          ref={fileInputRef}
          type="file" 
          accept=".xlsx, .xls"
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span className="flex items-center"><i className="fas fa-check-circle mr-1 text-emerald-500"></i> XLSX/XLS</span>
          <span className="flex items-center"><i className="fas fa-check-circle mr-1 text-emerald-500"></i> All Sheets Supported</span>
          <span className="flex items-center"><i className="fas fa-check-circle mr-1 text-emerald-500"></i> Header Validation</span>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
