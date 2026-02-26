import React from 'react'

/**
 * Error Boundary component to catch and display React errors
 * Prevents the entire app from crashing
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error)
      console.error('Error info:', errorInfo)
    }
    
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '500px',
          }}>
            <h1 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Nešto je pošlo po zlu</h1>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Naš tim je obaviješten o problemu. Pokušajte osvježiti stranicu.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                textAlign: 'left',
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Detalji greške
                </summary>
                <p style={{ color: '#d32f2f', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                </p>
                <p style={{ color: '#999', whiteSpace: 'pre-wrap' }}>
                  {this.state.errorInfo?.componentStack}
                </p>
              </details>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Pokušaj ponovno
              </button>
              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Vratite se na početnu
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
