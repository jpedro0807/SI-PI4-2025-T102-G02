import React from 'react';
import { Users, Calendar, DollarSign, Activity } from 'lucide-react';


import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import DashboardCard from '../../components/DashboardCard/DashboardCard.jsx';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
    
      <Sidebar activePage="dashboard" />

      
      <main className="flex-1 ml-64 p-8">
        
        
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Bem-vindo ao Health Money</p>
        </header>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Total de Pacientes" 
            value="0" 
            iconBg="bg-blue-50 text-blue-500"
            icon={<Users />} 
          />
          <DashboardCard 
            title="Atendimentos (Mês)" 
            value="0" 
            iconBg="bg-purple-50 text-purple-500"
            icon={<Calendar />} 
          />
          <DashboardCard 
            title="Receita do Mês" 
            value="R$ 0.00" 
            subtitle="+ 12% vs mês anterior"
            iconBg="bg-emerald-50 text-emerald-500"
            icon={<DollarSign />} 
          />
          <DashboardCard 
            title="Saldo do Mês" 
            value="R$ 0.00" 
            iconBg="bg-emerald-50 text-emerald-500"
            icon={<Activity />} 
          />
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
          
      
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Activity size={18} className="text-emerald-500" />
                Fluxo de Caixa (6 meses)
              </h3>
            </div>
            
           
            <div className="flex-1 border-l border-b border-gray-200 relative">
             
              <div className="h-full w-full grid grid-cols-6 items-end px-2 pb-2">
                 {['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'].map(mes => (
                   <span key={mes} className="text-xs text-gray-400 text-center">{mes}</span>
                 ))}
              </div>
            </div>
          </div>

        
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-purple-500" />
              Atendimentos por Tipo
            </h3>
            
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Nenhum atendimento registrado
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}