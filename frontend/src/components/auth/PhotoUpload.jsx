import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, User } from 'lucide-react';

export default function PhotoUpload({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => onChange(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => onChange(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative w-24 h-24 rounded-full overflow-hidden
          border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-primary/10 scale-105' 
            : 'border-border hover:border-primary/50 bg-muted/50'
          }
          group cursor-pointer
        `}
      >
        {value ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={value}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <User size={32} />
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-1"
        >
          <Camera size={20} className="text-primary" />
          <span className="text-xs text-foreground font-medium">Upload</span>
        </motion.div>
      </motion.button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <span className="text-xs text-muted-foreground">Profile Photo</span>
    </div>
  );
}
