"use client";
import './globals.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Inter } from 'next/font/google'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [isMinimized, setMinimized] = useState<boolean>(false);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  return (
    <html lang="en">
      <head />
      <body className='min-h-screen'>
        <Provider store={store}>
          <Header isMinimized={isMinimized} setMinimized={setMinimized} isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} />
          <div className='relative m-0'>
            {isAuthenticated && (
              <div className='col-span-3 sm:col-span-1 md:col-span-2   lg:col-span-2'>
                <Sidebar isMinimized={isMinimized} setMinimized={setMinimized} />
              </div>
            )}
            <div className={`${(isAuthenticated == true && isMinimized == false) ? "sm:ml-64" : ""} ${(isAuthenticated && isMinimized == true) ? "sm:ml-24" : "sm:m-0"} ${(isAuthenticated ? 'p-4' : '')} mt-16 sm:mt-16 bg-slate-100`}>
              <div className="p-2  rounded-lg dark:border-gray-700">
                <div className="mb-4 p-2 bg-white dark:bg-gray-800 rounded-md">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </Provider>
      </body>
    </html>
  )
}
