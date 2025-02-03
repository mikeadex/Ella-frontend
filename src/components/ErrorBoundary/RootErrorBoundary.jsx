import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #FEF2F2;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #DC2626;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #7F1D1D;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const ActionButton = styled.button`
  background-color: #DC2626;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 0 0.5rem;

  &:hover {
    background-color: #B91C1C;
  }

  &:focus {
    outline: 2px solid #DC2626;
    outline-offset: 2px;
  }
`;

class RootErrorBoundary extends React.Component {
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

    // Log the error
    console.error('Critical application error:', error, errorInfo);
    
    // You can add error reporting service here
    // Example: Sentry.captureException(error);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleNavigateHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer role="alert" aria-live="assertive">
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            We apologize, but something unexpected happened. You can try refreshing the page or return to the homepage.
          </ErrorMessage>
          <div>
            <ActionButton
              onClick={this.handleRefresh}
              aria-label="Refresh the page"
            >
              Refresh Page
            </ActionButton>
            <ActionButton
              onClick={this.handleNavigateHome}
              aria-label="Return to homepage"
            >
              Go to Homepage
            </ActionButton>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left max-w-2xl mx-auto">
              <summary className="cursor-pointer text-red-800 font-medium">
                Error details (Development Only)
              </summary>
              <pre className="mt-2 p-4 bg-white rounded shadow-inner overflow-auto text-sm">
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default RootErrorBoundary;
