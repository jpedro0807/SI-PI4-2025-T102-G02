import React from 'react';
import { Search, Plus, FileText } from 'lucide-react'; 

export default function NotasFiscaisPage() {
  return (
    <main className="flex-1 ml-64 p-8">
      
     
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Notas Fiscais</h2>
          <p className="text-gray-500 mt-1">Gerencie as NFS-e emitidas</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
          <Plus size={16} />
          Emitir Nova Nota Fiscal
        </button>
      </header>


      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por paciente ou número da nota..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

   
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col items-center justify-center">
        <FileText size={48} className="text-gray-300" />
        <p className="text-gray-500 mt-4 text-sm font-medium">
          Nenhuma nota fiscal emitida ainda
        </p>
      </div>

    </main>
  );
}