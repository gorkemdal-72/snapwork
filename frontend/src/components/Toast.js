import React from 'react';

const Toast = ({ notifications, removeNotification }) => {
    return (
        // KONUM AYARI: fixed bottom-4 right-4 (Sağ Alt Köşe)
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
            {notifications.map((note) => (
                <div
                    key={note.id}
                    className={`
            pointer-events-auto flex items-start gap-3 p-4 rounded shadow-lg min-w-[300px] max-w-sm
            transform transition-all duration-500 ease-in-out
            ${note.exiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
            bg-slate-800 text-gray-100 border-l-4
            ${note.type === 'success' ? 'border-green-500' : ''}
            ${note.type === 'error' ? 'border-red-500' : ''}
            ${note.type === 'info' ? 'border-blue-500' : ''}
          `}
                    // Tailwind yüklü değilse diye garanti stil (Koyu Tema)
                    style={{
                        backgroundColor: '#1e293b',
                        color: '#f3f4f6',
                        marginBottom: '10px'
                    }}
                >
                    {/* İkon Alanı */}
                    <div className="mt-1">
                        {note.type === 'success' && <i className="fa-solid fa-check-circle" style={{color: '#4ade80', fontSize:'1.2rem'}}></i>}
                        {note.type === 'error' && <i className="fa-solid fa-exclamation-circle" style={{color: '#f87171', fontSize:'1.2rem'}}></i>}
                        {note.type === 'info' && <i className="fa-solid fa-info-circle" style={{color: '#60a5fa', fontSize:'1.2rem'}}></i>}
                    </div>

                    {/* İçerik Alanı */}
                    <div className="flex-1" style={{ marginLeft: '12px' }}>
                        <h4 className="font-bold text-sm" style={{ fontWeight: 'bold' }}>{note.title}</h4>
                        <p className="text-sm text-gray-300 mt-1" style={{ marginTop: '4px', fontSize: '0.9rem', color: '#d1d5db' }}>{note.message}</p>
                    </div>

                    {/* Kapatma Butonu */}
                    <button
                        onClick={() => removeNotification(note.id)}
                        style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', marginLeft: '10px' }}
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;