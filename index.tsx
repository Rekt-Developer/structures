import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

type Folder = {
  name: string;
  files: string[];
  subFolders: Folder[];
};

const App: React.FC = () => {
  const [structure, setStructure] = useState<Folder[]>([]);
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // Add Folder Logic
  const addFolder = () => {
    if (!folderName.trim()) return alert('Folder name is required!');
    const newFolder: Folder = { name: folderName, files: [], subFolders: [] };
    modifyStructure(structure, currentPath, (folder) => folder.subFolders.push(newFolder));
    setFolderName('');
  };

  // Add File Logic
  const addFile = () => {
    if (!fileName.trim()) return alert('File name is required!');
    modifyStructure(structure, currentPath, (folder) => folder.files.push(fileName));
    setFileName('');
  };

  // Utility to Modify Structure
  const modifyStructure = (
    structure: Folder[],
    path: string[],
    callback: (folder: Folder) => void
  ) => {
    const newStructure = [...structure];
    let target: Folder | undefined = path.reduce((folder, name) => {
      return folder?.subFolders.find((f) => f.name === name);
    }, { subFolders: newStructure } as Folder);

    if (target) callback(target);
    else setStructure([...structure, { name: folderName, files: [], subFolders: [] }]);
  };

  // Navigation Logic
  const navigateToFolder = (name: string) => setCurrentPath([...currentPath, name]);
  const navigateBack = () => setCurrentPath(currentPath.slice(0, -1));

  // Render Folders and Files
  const renderStructure = (folders: Folder[]) =>
    folders.map((folder) => (
      <div key={folder.name} style={{ marginLeft: '20px' }}>
        <div
          style={{ cursor: 'pointer', fontWeight: 'bold', color: '#007BFF' }}
          onClick={() => navigateToFolder(folder.name)}
        >
          📁 {folder.name}
        </div>
        {folder.files.map((file) => (
          <div key={file} style={{ marginLeft: '20px' }}>
            🗂️ {file}
          </div>
        ))}
        {renderStructure(folder.subFolders)}
      </div>
    ));

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Advanced Folder Structure Generator</h1>
        <p>Create dynamic, nested folder and file structures with ease.</p>
      </header>

      {/* Breadcrumb Navigation */}
      <nav style={styles.breadcrumb}>
        <span style={styles.link} onClick={() => setCurrentPath([])}>
          Root
        </span>
        {currentPath.map((folder, index) => (
          <span key={folder}>
            {' / '}
            <span
              style={styles.link}
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
            >
              {folder}
            </span>
          </span>
        ))}
      </nav>

      {/* Add Folder and File */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          style={styles.input}
        />
        <button onClick={addFolder} style={styles.button}>
          Add Folder
        </button>
      </div>
      <div style={styles.form}>
        <input
          type="text"
          placeholder="File name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={styles.input}
        />
        <button onClick={addFile} style={styles.button}>
          Add File
        </button>
      </div>

      {/* Structure View */}
      <section style={styles.structure}>
        {currentPath.length > 0 && (
          <div style={{ cursor: 'pointer', color: 'red' }} onClick={navigateBack}>
            🔙 Back
          </div>
        )}
        {renderStructure(structure)}
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>
          &copy; 2024 <strong>Likhon Sheikh</strong> |{' '}
          <a href="https://t.me/RektDevelopers" target="_blank" rel="noopener noreferrer">
            t.me/RektDevelopers
          </a>
        </p>
      </footer>
    </div>
  );
};

// Styles (Inline for Modular Usage)
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '20px auto',
    padding: '20px',
    maxWidth: '900px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  breadcrumb: {
    marginBottom: '20px',
    fontSize: '14px',
    color: '#666',
  },
  link: {
    cursor: 'pointer',
    color: '#007BFF',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  structure: {
    marginTop: '20px',
    fontSize: '16px',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  },
};

// Render the Application
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
