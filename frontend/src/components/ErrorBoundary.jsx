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
            <p className='text-sm m-auto'>Press <span className='font-extrabold'>CTRL + R</span> to Reload the browser</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;