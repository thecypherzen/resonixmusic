import React, { Component } from 'react';
import { MdErrorOutline } from "react-icons/md";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen">
          <div className="flex flex-col w-full m-auto gap-3 text-neutral-600">
            <MdErrorOutline size={102} className='m-auto' />
            <h1 className='text-2xl m-auto'>Oops... Something went wrong!</h1>
            <button
              onClick={() => window.location.reload()}
              className="text-sm mt-4 px-8 py-2 bg-transparent border rounded-full border-neutral-700 hover:bg-neutral-800 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;