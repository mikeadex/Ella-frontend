import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #FEF2F2;
  border: 1px solid #FCA5A5;
  margin: 1rem 0;
`;

const ErrorTitle = styled.h3`
  color: #DC2626;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: #7F1D1D;
  margin-bottom: 1rem;
`;

const RetryButton = styled.button`
  background-color: #DC2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #B91C1C;
  }

  &:focus {
    outline: 2px solid #DC2626;
    outline-offset: 2px;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log the error to your error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You can add error reporting service here
    // Example: Sentry.captureException(error);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer role="alert" aria-live="assertive">
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            {this.props.fallbackMessage || 
             'We encountered an error while loading this section. Please try again.'}
          </ErrorMessage>
          {this.props.showError && this.state.error && (
            <details className="mt-2 text-sm text-red-800">
              <summary>Error details</summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <RetryButton
            onClick={this.handleRetry}
            aria-label="Retry loading the section"
          >
            Try Again
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
