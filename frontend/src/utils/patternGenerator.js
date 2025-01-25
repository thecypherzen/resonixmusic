const COLORS = [
  ['#FF6B6B', '#4ECDC4'], // Red & Teal
  ['#45B7D1', '#FFBE0B'], // Blue & Yellow
  ['#96CEB4', '#FFEEAD'], // Mint & Cream
  ['#9B5DE5', '#00BBF9'], // Purple & Blue
  ['#2EC4B6', '#FF9F1C'], // Turquoise & Orange
  ['#F72585', '#4CC9F0'], // Pink & Light Blue
  ['#7209B7', '#4361EE'], // Deep Purple & Blue
  ['#4D908E', '#F94144'], // Sea Green & Red
  ['#277DA1', '#F9C74F'], // Ocean Blue & Yellow
  ['#43AA8B', '#F8961E'],  // Green & Orange
  ['#EF476F', '#FFD166'], // Coral Pink & Mustard Yellow
  ['#06D6A0', '#118AB2'], // Aqua Green & Deep Cyan
  ['#073B4C', '#FFD166'], // Midnight Blue & Soft Yellow
  ['#FF8C42', '#2E4057'], // Bright Orange & Slate Blue
  ['#D7263D', '#3B8EA5'], // Crimson & Light Blue
  ['#A4036F', '#F2A71B'], // Magenta & Golden Yellow
  ['#8338EC', '#FB5607'], // Violet & Tangerine
  ['#2A9D8F', '#E76F51'], // Jade Green & Burnt Orange
  ['#3D5A80', '#EE6C4D'], // Steel Blue & Warm Coral
  ['#F4A261', '#264653']  // Peach & Deep Teal
];

export const generatePattern = (id) => {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  // Get deterministic colors based on id
  const numericId = id.replace(/\D/g) || 0;
  const length = COLORS.length;
  const xFactor = 10 ** length.toString().length;
  const colorIndex = Math.floor((Math.random(Date.now()) * xFactor))
        % length;
  const [bgColor, patternColor] = COLORS[colorIndex];
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Generate pattern based on ID
  const patternType = numericId % 4;
  const size = 20;

  ctx.fillStyle = patternColor;

  switch (patternType) {
    case 0: // Dots
      for (let x = 0; x < canvas.width; x += size * 2) {
        for (let y = 0; y < canvas.height; y += size * 2) {
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, size / 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;

    case 1: // Lines
      for (let x = 0; x < canvas.width; x += size * 2) {
        ctx.fillRect(x, 0, size / 2, canvas.height);
      }
      break;

    case 2: // Diagonal lines
      for (let x = -canvas.height; x < canvas.width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + canvas.height, canvas.height);
        ctx.lineWidth = size / 2;
        ctx.strokeStyle = patternColor;
        ctx.stroke();
      }
      break;

    case 3: // Squares
      for (let x = 0; x < canvas.width; x += size * 2) {
        for (let y = 0; y < canvas.height; y += size * 2) {
          ctx.fillRect(x, y, size, size);
        }
      }
      break;
  }

  return canvas.toDataURL('image/png');
};

export const getPlaylistThumbnail = (playlistId) => {
  try {
    return generatePattern(playlistId);
  } catch (error) {
    console.error('Error generating playlist thumbnail:', error);
    return null;
  }
};

// Cache for storing generated patterns
const patternCache = new Map();

export const getCachedPlaylistThumbnail = (playlistId) => {
  if (!patternCache.has(playlistId)) {
    patternCache.set(playlistId, getPlaylistThumbnail(playlistId));
  }
  return patternCache.get(playlistId);
};

export const getArtistThumbnail = (artistId) => {
  try {
    // Use a different set of colors or pattern types for artists
    const numericId = parseInt(artistId.replace(/\D/g, '')) || 0;
    return generatePattern(artistId, {
      patternType: (numericId % 6), // More pattern types for artists
      colors: COLORS[(numericId + 3) % COLORS.length] // Offset color selection
    });
  } catch (error) {
    console.error('Error generating artist thumbnail:', error);
    return null;
  }
};

// Add artist-specific caching
const artistPatternCache = new Map();

export const getCachedArtistThumbnail = (artistId) => {
  if (!artistPatternCache.has(artistId)) {
    artistPatternCache.set(artistId, getArtistThumbnail(artistId));
  }
  return artistPatternCache.get(artistId);
};
