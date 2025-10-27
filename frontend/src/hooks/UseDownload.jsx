import { useContext } from "react";

const DownLoadContext = createContext({
  downloadTrack: () => {},
  downloadZip: () => {},
  isLoading: false,
  error: null,
});

function DownloadProvider({ children }) {
  return (
    <DownLoadContext.DownloadProvider
      value={{ downloadTrack, downloadZip, error, isLoading }}
    >
      {children}
    </DownLoadContext.DownloadProvider>
  );
}

export function UseDownload() {
  const context = useContext(DownLoadContext);
  if (!context) {
    throw new Error("UseDownload must be used within a DownloadProvider");
  }
  return context;
}

export { DownloadProvider };
export default UseDownload;
