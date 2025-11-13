import React from 'react';
import { Plus } from 'lucide-react';


import { Calendar, dateFnsLocalizer } from 'react-big-calendar';


import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';


import 'react-big-calendar/lib/css/react-big-calendar.css';


const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }), 
  getDay,
  locales,
});

const messages = {
  allDay: 'Dia todo',
  previous: '<',
  next: '>',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste período.',
  showMore: total => `+ Ver mais (${total})`
};


export default function AgendaPage() {
  

  const [events, setEvents] = React.useState([]);
  
  return (
    <main className="flex-1 ml-64 p-8">
      
     
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Agenda</h2>
          <p className="text-gray-500 mt-1">Gerencie seus atendimentos</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
          <Plus size={16} />
          Novo Atendimento
        </button>
      </header>

   
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        
      
        <Calendar
          localizer={localizer}
          events={events}
          messages={messages}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={['month', 'week', 'day']}
          style={{ height: '800px' }} 
          className="font-sans"
        />
      </div>
    </main>
  );
}