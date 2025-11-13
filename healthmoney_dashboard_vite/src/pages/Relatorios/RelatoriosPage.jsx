import React from 'react';

import { ChevronDown, Download } from 'lucide-react';


import { Activity, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';


import DashboardCard from '../../components/DashboardCard/DashboardCard';

export default function RelatoriosPage() {
  return (
    <main className="flex-1 ml-64 p-8">
      
     
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Relatórios Financeiros</h2>
          <p className="text-gray-500 mt-1">Análise de receitas e despesas</p>
        </div>
        <div className="flex items-center gap-4">
         
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            Este Mês
            <ChevronDown size={16} />
          </button>
         
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Download size={16} /> 
            Exportar
          </button>
        </div>
      </header>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Receita Total" 
          value="R$ 0.00" 
          iconBg="bg-emerald-50 text-emerald-500"
          icon={<Activity />} 
        />
        <DashboardCard 
          title="Despesas Totais" 
          value="R$ 0.00" 
          iconBg="bg-red-50 text-red-500"
          icon={<TrendingDown />} 
        />
        <DashboardCard 
          title="Saldo" 
          value="R$ 0.00" 
          iconBg="bg-emerald-50 text-emerald-500"
          icon={<DollarSign />} 
        />
        <DashboardCard 
          title="A Receber" 
          value="R$ 0.00" 
          iconBg="bg-yellow-50 text-yellow-500"
          icon={<BarChart3 />} 
        />
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4">
            Receitas por Categoria
          </h3>
         
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            (Espaço para o gráfico de receitas)
          </div>
        </div>

      
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4">
            Despesas por Categoria
          </h3>
        
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            (Espaço para o gráfico de despesas)
          </div>
        </div>

      </div>
    </main>
  );
}