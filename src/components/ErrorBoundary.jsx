import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);
    
    // Store error details in state
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    // Reset error state and attempt to recover
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Render user-friendly error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-orange-900 p-4">
          <div className="max-w-md w-full bg-gray-900 border-2 border-orange-500 rounded-lg p-6 shadow-2xl">
            <div className="text-center mb-4">
              <span className="text-6xl">👻</span>
            </div>
            <h1 className="text-2xl font-bold text-orange-500 mb-2 text-center">
              Oops! Something Spooky Happened
            </h1>
            <p className="text-gray-300 mb-4 text-center">
              The ghost got a little too mischievous and something went wrong. Don't worry, your study data is safe!
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded p-3 mb-4">
              <p className="text-sm text-gray-400 font-mono break-words">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={this.handleReset}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-gray-400">
                  Developer Details
                </summary>
                <pre className="mt-2 overflow-auto bg-gray-950 p-2 rounded">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
