import React, { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react"; // Adicionei X e Loader2
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configuração do Localizer
const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
	getDay,
	locales,
});

const messages = {
	allDay: "Dia todo",
	previous: "<",
	next: ">",
	today: "Hoje",
	month: "Mês",
	week: "Semana",
	day: "Dia",
	agenda: "Agenda",
	date: "Data",
	time: "Hora",
	event: "Evento",
	noEventsInRange: "Não há eventos neste período.",
	showMore: (total) => `+ Ver mais (${total})`,
};

export default function AgendaPage() {
	const [events, setEvents] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	// Estado do Formulário
	const [novoEvento, setNovoEvento] = useState({
		titulo: "",
		dataInicio: "",
		horaInicio: "",
		horaFim: "",
		descricao: "",
		emailPaciente: "",
	});

	const fetchEvents = async () => {
		try {
			const response = await fetch("/api/agenda/listar");

			if (response.status === 401) {
				console.warn("Sessão expirada. Redirecionando...");
				window.location.href = "http://localhost:8080/login";
				return;
			}

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				const eventosFormatados = data.map((evt) => ({
					title: evt.titulo,
					start: new Date(evt.inicio),
					end: new Date(evt.fim || evt.inicio),
					resource: evt,
				}));

				setEvents(eventosFormatados);
			} else {
				console.error("Erro na resposta da API:", response.status);
			}
		} catch (error) {
			console.error("Erro ao buscar agenda:", error);
		}
	};
	// Carrega ao abrir a página
	useEffect(() => {
		fetchEvents();
	}, []);

	// 2. SALVAR NOVO EVENTO (POST)
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Montar as datas no formato ISO que o Java espera (YYYY-MM-DDTHH:mm:ss)
		const dataInicioISO = `${novoEvento.dataInicio}T${novoEvento.horaInicio}:00`;
		const dataFimISO = `${novoEvento.dataInicio}T${novoEvento.horaFim}:00`;

		const payload = {
			titulo: novoEvento.titulo,
			dataInicio: dataInicioISO,
			dataFim: dataFimISO,
			descricao: novoEvento.descricao,
			emailPaciente: novoEvento.emailPaciente,
		};

		try {
			const response = await fetch("/api/agenda/criar", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (response.status === 401) {
				console.warn("Sessão expirada. Redirecionando...");
				window.location.href = "http://localhost:8080/login";
				return;
			}

			if (response.ok) {
				alert("Agendamento criado com sucesso!");
				setIsModalOpen(false); // Fecha modal
				setNovoEvento({
					titulo: "",
					dataInicio: "",
					horaInicio: "",
					horaFim: "",
					descricao: "",
					emailPaciente: "",
				}); // Limpa form
				fetchEvents(); // Recarrega calendário
			} else {
				console.error("Erro:", error);
			}
		} catch (error) {
			console.error("Erro:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className='flex-1 ml-64 p-8 relative'>
			{/* CABEÇALHO */}
			<header className='flex justify-between items-center mb-8'>
				<div>
					<h2 className='text-3xl font-bold text-gray-900'>Agenda</h2>
					<p className='text-gray-500 mt-1'>Gerencie seus atendimentos</p>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className='flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors'>
					<Plus size={16} />
					Novo Atendimento
				</button>
			</header>

			{/* CALENDÁRIO */}
			<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
				<Calendar
					localizer={localizer}
					events={events}
					messages={messages}
					culture='pt-BR'
					startAccessor='start'
					endAccessor='end'
					defaultView='month'
					views={["month", "week", "day"]}
					style={{ height: "700px" }}
					className='font-sans text-gray-600'
					// Estilização das barras de evento
					eventPropGetter={(event) => ({
						style: {
							backgroundColor: "#10b981", // Cor Emerald do Tailwind
							borderRadius: "4px",
							border: "none",
							color: "white",
							fontSize: "0.85rem",
						},
					})}
				/>
			</div>

			{/* MODAL DE CADASTRO (Novo) */}
			{isModalOpen && (
				<div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200'>
						<div className='flex justify-between items-center p-5 border-b'>
							<h3 className='text-xl font-bold text-gray-800'>
								Novo Agendamento
							</h3>
							<button
								onClick={() => setIsModalOpen(false)}
								className='text-gray-400 hover:text-gray-600'>
								<X size={24} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className='p-5 space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Título / Paciente
								</label>
								<input
									required
									type='text'
									className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none'
									value={novoEvento.titulo}
									onChange={(e) =>
										setNovoEvento({
											...novoEvento,
											titulo: e.target.value,
										})
									}
									placeholder='Ex: Consulta João Silva'
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Data
									</label>
									<input
										required
										type='date'
										className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none'
										value={novoEvento.dataInicio}
										onChange={(e) =>
											setNovoEvento({
												...novoEvento,
												dataInicio: e.target.value,
											})
										}
									/>
								</div>
								<div>{/* Horários */}</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Início
									</label>
									<input
										required
										type='time'
										className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none'
										value={novoEvento.horaInicio}
										onChange={(e) =>
											setNovoEvento({
												...novoEvento,
												horaInicio: e.target.value,
											})
										}
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Fim
									</label>
									<input
										required
										type='time'
										className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none'
										value={novoEvento.horaFim}
										onChange={(e) =>
											setNovoEvento({
												...novoEvento,
												horaFim: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Email do Paciente (Convite)
								</label>
								<input
									type='email'
									className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none'
									placeholder='paciente@email.com'
									value={novoEvento.emailPaciente}
									onChange={(e) =>
										setNovoEvento({
											...novoEvento,
											emailPaciente: e.target.value,
										})
									}
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Observações
								</label>
								<textarea
									className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none'
									rows='3'
									value={novoEvento.descricao}
									onChange={(e) =>
										setNovoEvento({
											...novoEvento,
											descricao: e.target.value,
										})
									}></textarea>
							</div>

							<div className='pt-2'>
								<button
									type='submit'
									disabled={loading}
									className='w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-colors flex justify-center items-center gap-2'>
									{loading ? (
										<Loader2 className='animate-spin' />
									) : (
										"Confirmar Agendamento"
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</main>
	);
}
