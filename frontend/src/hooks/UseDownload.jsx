import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const DownLoadContext = createContext({
  downloadTrack: () => {},
  downloadZip: () => {},
  isLoading: false,
  error: null,
});

export function DownloadProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // download single track
  const downloadTrack = useCallback(async (track) => {
    if (!track || !track.audio) return;
    try {
      const res = await axios.get(track.audio, {
        responseType: "blob",
      });

      saveAs(res.data, `${track.name || "downloaded_file"}.mp3`);
    } catch (err) {
      setError({
        message: error?.message ?? "For an unknown reason",
        details: error,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // handle download multiple tracks as zip
  const downloadZip = useCallback(async (tracks, filename = "collection") => {
    const JSZip = await import("jszip");
    const zip = new JSZip.default();
    if (!tracks || !tracks.length) return;

    try {
      setIsLoading(true);
      const downloadPromises = tracks.map(async (track, i) => {
        if (!track.audio) return;
        const response = await axios.get(track.audio, {
          responseType: "blob",
        });
        zip.file(`${track.name || `track_${i + 1}`}.mp3`, response.data);
      });

      await Promise.all(downloadPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${filename}.zip`);
    } catch (error) {
      setError({
        message: error?.message ?? "For an unknown reason",
        details: error,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
      return;
    }
  }, [error]);

  return (
    <DownLoadContext.Provider
      value={{ downloadTrack, downloadZip, isLoading, error }}
    >
      {children}
    </DownLoadContext.Provider>
  );
}

export function UseDownload() {
  const context = useContext(DownLoadContext);
  if (!context) {
    throw new Error("UseDownload must be used within a DownloadProvider");
  }
  return context;
}

export default UseDownload;
