import React, { useEffect, useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [files, setFiles] = useState<any[]>([]);
  const [downloadCounts, setDownloadCounts] = useState<any>({});

  const getDownloadCountsFromLocalStorage = () => {
    const storedCounts = localStorage.getItem('downloadCounts');
    return storedCounts ? JSON.parse(storedCounts) : {};
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching files.json...");

        const response = await fetch('/myProjects/files.json');
        
        // Sprawdzenie, czy odpowiedź jest poprawna
        if (!response.ok) {
          console.error("Failed to fetch files.json");
          return;
        }

        const data = await response.json();

        console.log("Fetched data:", data); // Logowanie danych z pliku JSON

        setFiles(data);
        setDownloadCounts(getDownloadCountsFromLocalStorage());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDownload = (id: number, downloadUrl: string) => {
    const newCounts = { ...downloadCounts };
    newCounts[id] = (newCounts[id] || 0) + 1;
    setDownloadCounts(newCounts);
    localStorage.setItem('downloadCounts', JSON.stringify(newCounts));
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="App">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Rozmiar</th>
            <th>Wersja</th>
            <th>Data wydania</th>
            <th>Ilość pobrań</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 ? (
            files.map((file, idx) => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>{file.name}</td>
                <td>{file.size}</td>
                <td>{file.version}</td>
                <td>{file.releaseDate}</td>
                <td>
                  <span className="me-2">{downloadCounts[file.id] || 0}</span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleDownload(file.id, file.downloadUrl)}
                  >
                    Pobierz
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Brak danych do wyświetlenia</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
