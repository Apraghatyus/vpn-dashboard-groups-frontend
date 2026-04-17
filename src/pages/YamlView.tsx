import React from 'react';
import { useYaml } from '../hooks/useYaml';
import { Header } from '../components/Layout/Header';
import './YamlView.css';

function highlightYaml(yaml: string): React.ReactNode[] {
  return yaml.split('\n').map((line, i) => {
    let el: React.ReactNode;

    if (line.startsWith('#')) {
      el = <span className="yaml-comment">{line}</span>;
    } else if (line.includes('- "')) {
      const parts = line.split('"');
      el = (
        <>
          <span className="yaml-indent">{parts[0]}</span>
          <span className="yaml-string">"{parts[1]}"</span>
        </>
      );
    } else if (line.includes(': "')) {
      const colonIdx = line.indexOf(':');
      const key = line.slice(0, colonIdx);
      const rest = line.slice(colonIdx);
      el = (
        <>
          <span className="yaml-key">{key}</span>
          <span className="yaml-indent">: </span>
          <span className="yaml-string">{rest.slice(2)}</span>
        </>
      );
    } else if (line.includes(':') && !line.includes('"')) {
      const colonIdx = line.indexOf(':');
      const key = line.slice(0, colonIdx);
      el = (
        <>
          <span className="yaml-key">{key}</span>
          <span className="yaml-indent">:</span>
        </>
      );
    } else {
      el = <span className="yaml-indent">{line}</span>;
    }

    return (
      <div key={i}>
        {el}
      </div>
    );
  });
}

export function YamlView() {
  const { yaml, copyToClipboard, download, copied } = useYaml();

  return (
    <>
      <Header title="Configuración YAML" subtitle="Output listo para aplicar" />
      <div className="page-content">
        <div className="yaml-page">
          <div className="yaml-card">
            <div className="yaml-header">
              <span className="yaml-filename">wg-acl.yaml</span>
              <div className="yaml-actions">
                <button
                  className={`yaml-btn ${copied ? 'copied' : ''}`}
                  onClick={copyToClipboard}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
                <button className="yaml-btn" onClick={() => download()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar
                </button>
              </div>
            </div>
            <div className="yaml-code">
              <pre>{highlightYaml(yaml)}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
