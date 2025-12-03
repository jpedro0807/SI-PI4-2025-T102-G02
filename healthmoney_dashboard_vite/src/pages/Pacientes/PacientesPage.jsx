import React, { useState, useEffect } from "react";
import { Search, Plus, Users, X, Edit, Trash2, Loader2 } from "lucide-react";

export default function PacientesPage() {
	const [pacientes, setPacientes] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	// Estado para controlar a edição
	const [editingId, setEditingId] = useState(null);

	const [formData, setFormData] = useState({
		nome: "",
		cpf: "",
		dataNascimento: "",
		email: "",
		telefone: "",
		endereco: "",
	});

	const fetchPacientes = async () => {
		try {
			const response = await fetch("/api/pacientes");
			if (response.status === 401) {
				window.location.href = "http://localhost:8080/loginGoogle";
				return;
			}
			const data = await response.json();
			setPacientes(data);
		} catch (error) {
			console.error("Erro ao buscar pacientes:", error);
		}
	};

	useEffect(() => {
		fetchPacientes();
	}, []);

	// Função para Abrir o Modal (Criar ou Editar)
	const openModal = (paciente = null) => {
		if (paciente) {
			setEditingId(paciente.id);
			setFormData({
				nome: paciente.nome,
				cpf: paciente.cpf,
				dataNascimento: paciente.dataNascimento,
				email: paciente.email || "",
				telefone: paciente.telefone,
				endereco: paciente.endereco || "",
			});
		} else {
			setEditingId(null);
			setFormData({
				nome: "",
				cpf: "",
				dataNascimento: "",
				email: "",
				telefone: "",
				endereco: "",
			});
		}
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		if (confirm("Tem certeza que deseja excluir este paciente?")) {
			await fetch(`/api/pacientes/${id}`, { method: "DELETE" });
			fetchPacientes();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Lógica de Criar vs Editar
			const url = editingId
				? `/api/pacientes/${editingId}`
				: "/api/pacientes";
			const method = editingId ? "PUT" : "POST";

			const response = await fetch(url, {
				method: method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				alert(editingId ? "Paciente atualizado!" : "Paciente cadastrado!");
				setIsModalOpen(false);
				fetchPacientes();
			} else {
				alert("Erro ao salvar.");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const pacientesFiltrados = pacientes.filter(
		(p) =>
			p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
			p.cpf.includes(searchTerm)
	);

	return (
		<main className='flex-1 ml-64 p-8 relative'>
			<header className='flex justify-between items-center mb-8'>
				<div>
					<h2 className='text-3xl font-bold text-gray-900'>Pacientes</h2>
					<p className='text-gray-500 mt-1'>
						Gerencie o cadastro de pacientes
					</p>
				</div>
				<button
					onClick={() => openModal()}
					className='flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors'>
					<Plus size={16} /> Novo Paciente
				</button>
			</header>

			<div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 relative'>
				<Search className='absolute left-7 top-7 text-gray-400' size={20} />
				<input
					type='text'
					placeholder='Buscar por nome ou CPF...'
					className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{pacientes.length === 0 ? (
				<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center'>
					<Users size={48} className='text-gray-300' />
					<p className='text-gray-500 mt-4 text-sm font-medium'>
						Nenhum paciente cadastrado
					</p>
				</div>
			) : (
				<div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
					<table className='w-full text-left'>
						<thead className='bg-gray-50 border-b border-gray-100'>
							<tr>
								{/* COLUNAS ORIGINAIS RESTAURADAS */}
								<th className='p-4 font-semibold text-gray-600'>
									Nome
								</th>
								<th className='p-4 font-semibold text-gray-600'>CPF</th>
								<th className='p-4 font-semibold text-gray-600'>
									Email
								</th>
								<th className='p-4 font-semibold text-gray-600'>
									Telefone
								</th>
								<th className='p-4 font-semibold text-gray-600 text-right'>
									Ações
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-100'>
							{pacientesFiltrados.map((paciente) => (
								<tr
									key={paciente.id}
									className='hover:bg-gray-50 transition-colors'>
									<td className='p-4 font-medium text-gray-900'>
										{paciente.nome}
									</td>
									<td className='p-4 text-gray-600'>{paciente.cpf}</td>
									{/* EMAIL EM COLUNA SEPARADA NOVAMENTE */}
									<td className='p-4 text-gray-600'>
										{paciente.email}
									</td>
									<td className='p-4 text-gray-600'>
										{paciente.telefone}
									</td>
									<td className='p-4 text-right flex justify-end gap-2'>
										<button
											onClick={() => openModal(paciente)}
											className='p-2 text-blue-500 hover:bg-blue-50 rounded-lg'>
											<Edit size={18} />
										</button>
										<button
											onClick={() => handleDelete(paciente.id)}
											className='p-2 text-red-500 hover:bg-red-50 rounded-lg'>
											<Trash2 size={18} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* MODAL */}
			{isModalOpen && (
				<div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200'>
						<div className='flex justify-between items-center p-5 border-b'>
							<h3 className='text-xl font-bold text-gray-800'>
								{editingId ? "Editar Paciente" : "Novo Paciente"}
							</h3>
							<button onClick={() => setIsModalOpen(false)}>
								<X
									size={24}
									className='text-gray-400 hover:text-gray-600'
								/>
							</button>
						</div>

						<form onSubmit={handleSubmit} className='p-5 space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Nome Completo
								</label>
								<input
									required
									type='text'
									className='w-full border p-2 rounded-lg'
									value={formData.nome}
									onChange={(e) =>
										setFormData({ ...formData, nome: e.target.value })
									}
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										CPF
									</label>
									<input
										required
										type='text'
										placeholder='000.000.000-00'
										className='w-full border p-2 rounded-lg'
										value={formData.cpf}
										onChange={(e) =>
											setFormData({
												...formData,
												cpf: e.target.value,
											})
										}
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Nascimento
									</label>
									<input
										required
										type='date'
										className='w-full border p-2 rounded-lg'
										value={formData.dataNascimento}
										onChange={(e) =>
											setFormData({
												...formData,
												dataNascimento: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Telefone
									</label>
									<input
										required
										type='text'
										className='w-full border p-2 rounded-lg'
										value={formData.telefone}
										onChange={(e) =>
											setFormData({
												...formData,
												telefone: e.target.value,
											})
										}
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Email
									</label>
									<input
										type='email'
										className='w-full border p-2 rounded-lg'
										value={formData.email}
										onChange={(e) =>
											setFormData({
												...formData,
												email: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Endereço
								</label>
								<textarea
									className='w-full border p-2 rounded-lg'
									rows='2'
									value={formData.endereco}
									onChange={(e) =>
										setFormData({
											...formData,
											endereco: e.target.value,
										})
									}></textarea>
							</div>

							<div className='pt-2'>
								<button
									type='submit'
									disabled={loading}
									className='w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 flex justify-center items-center gap-2'>
									{loading ? (
										<Loader2 className='animate-spin' />
									) : editingId ? (
										"Atualizar Dados"
									) : (
										"Salvar Paciente"
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
