'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}:{
    error : Error & { digest?: string };
    reset: () => void;
}){
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h2 className="text-center">Terjadi Kesalahan!</h2>
            <button 
                className='mt-4 rounded-md bg-blue-400 px-4 py-2 text-white transition-colors hover:bg-blue-400'
                onClick={
                    // Attempt to recover by trying to re-render the invoices route 
                    () => reset()
                }
                >
                    Try Again
                </button>
        </main>
    );

}