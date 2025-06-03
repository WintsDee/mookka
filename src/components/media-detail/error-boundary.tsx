
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MediaDetailErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MediaDetail Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Une erreur s'est produite lors de l'affichage de ce contenu.
              {this.state.error?.message && (
                <details className="mt-2 text-xs">
                  <summary>Détails de l'erreur</summary>
                  <pre className="mt-1 whitespace-pre-wrap">{this.state.error.message}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={this.handleRetry}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
