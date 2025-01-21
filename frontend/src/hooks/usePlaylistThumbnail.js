import { useState, useEffect } from 'react';
import { getCachedPlaylistThumbnail } from '../utils/patternGenerator';

export const usePlaylistThumbnail = (playlistId) => {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!playlistId) return;
    
    // Get or generate thumbnail
    const pattern = getCachedPlaylistThumbnail(playlistId);
    setThumbnail(pattern);
  }, [playlistId]);

  return thumbnail;
};