import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // TODO: send error details to an external logging service (Sentry/LogRocket, ...)
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Đã xảy ra lỗi!</h1>
          <p className="text-gray-700 mb-4">Ứng dụng gặp sự cố bất ngờ. Vui lòng thử nạp lại trang.</p>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Nạp lại
          </button>
          {this.state.error && (
            <details className="mt-4 text-left max-w-2xl overflow-auto bg-white p-3 rounded shadow-inner">
              <summary className="font-medium">Chi tiết lỗi</summary>
              <pre className="whitespace-pre-wrap break-words text-sm text-red-600">
                {this.state.error.toString()}
              </pre>
              {this.state.errorInfo?.componentStack && (
                <pre className="whitespace-pre-wrap break-words text-xs text-gray-500">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
