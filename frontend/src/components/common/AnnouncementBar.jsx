import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

export default function AnnouncementBar({ data }) {
  const [visible, setVisible] = useState(true);
  if (!visible || !data) return null;
  return (
    <div className="relative z-50 flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium"
      style={{ backgroundColor: data.bgColor || '#F0A500', color: data.textColor || '#000' }}>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span>{data.message}</span>
        {data.link && data.linkText && (
          <Link to={data.link} className="underline font-bold hover:opacity-80 transition-opacity">{data.linkText}</Link>
        )}
      </div>
      <button onClick={() => setVisible(false)} className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity">
        <FiX size={16} />
      </button>
    </div>
  );
}
