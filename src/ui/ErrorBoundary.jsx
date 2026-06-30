import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: '#0a0f19', color: 'white', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'sans-serif', zIndex: 9999
        }}>
          <div style={{ color: '#ED1C24', fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{ margin: '0 0 10px 0' }}>System Error</h1>
          <p style={{ color: '#aaa', maxWidth: '600px', textAlign: 'center' }}>
            The 3D renderer encountered a critical error while trying to parse the blueprint data.
            This is usually caused by an invalid or corrupted JSON file.
          </p>
          <div style={{ 
            backgroundColor: 'rgba(237, 28, 36, 0.1)', border: '1px solid #ED1C24', 
            padding: '15px', borderRadius: '8px', marginTop: '20px', color: '#ff9999',
            fontFamily: 'monospace', maxWidth: '80%', overflow: 'auto'
          }}>
            {this.state.error && this.state.error.toString()}
          </div>
          <button 
            onClick={() => window.location.href = '/'} 
            style={{ 
              marginTop: '30px', padding: '10px 20px', backgroundColor: '#00AEEF', 
              color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            RETURN TO GLOBAL MAP
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
