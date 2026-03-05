"use client";

import React, { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMessage: "" };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, info.componentStack);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="w-full h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Something went wrong</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm text-center">
                        {this.state.errorMessage || "An unexpected error occurred in the canvas. Please reload to continue."}
                    </p>
                    <button
                        onClick={this.handleReload}
                        className="mt-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
