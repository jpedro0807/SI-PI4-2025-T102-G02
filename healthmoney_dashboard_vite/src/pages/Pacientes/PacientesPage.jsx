import React, { useState, useEffect } from "react";
import {
	Search,
	Plus,
	Users,
	X,
	Edit,
	Trash2,
	Loader2,
	Calendar,
} from "lucide-react";

export default function PacientesPage() {
	const [pacientes, setPacientes] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	// Estado para erros de validação
	const [errors, setErrors] = useState({});

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
				window.location.href = "/login";
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

	// --- MÁSCARAS E FORMATAÇÃO ---
	const formatCPF = (value) => {
		return value
			.replace(/\D/g, "") // Remove tudo o que não é dígito
			.replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos
			.replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos
			.replace(/(\d{3})(\d{1,2})/, "$1-$2") // Coloca um hífen entre o terceiro e o quarto dígitos
			.replace(/(-\d{2})\d+?$/, "$1"); // Captura apenas os dois últimos dígitos
	};

	const formatPhone = (value) => {
		return value
			.replace(/\D/g, "")
			.replace(/(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{5})(\d)/, "$1-$2")
			.replace(/(-\d{4})\d+?$/, "$1");
	};

	// --- VALIDAÇÃO ---
	const validateForm = () => {
		const newErrors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		// Regex simples para CPF (apenas formato, não verifica dígito verificador matemático)
		const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

		// 1. Nome
		if (!formData.nome.trim()) {
			newErrors.nome = "Nome é obrigatório.";
		} else if (formData.nome.length > 255) {
			newErrors.nome = "Nome não pode ter mais de 255 caracteres.";
		}

		// 2. CPF
		if (!formData.cpf) {
			newErrors.cpf = "CPF é obrigatório.";
		} else if (!cpfRegex.test(formData.cpf)) {
			newErrors.cpf = "CPF inválido. Formato: 000.000.000-00";
		}

		// 3. Data de Nascimento
		if (!formData.dataNascimento) {
			newErrors.dataNascimento = "Data de nascimento é obrigatória.";
		} else {
			const dataNasc = new Date(formData.dataNascimento);
			const hoje = new Date();
			// Remove a hora para comparar apenas o dia
			hoje.setHours(0, 0, 0, 0);

			if (dataNasc > hoje) {
				newErrors.dataNascimento = "Data não pode ser no futuro.";
			}
		}

		// 4. Email
		if (!formData.email) {
			newErrors.email = "E-mail é obrigatório.";
		} else if (!emailRegex.test(formData.email)) {
			newErrors.email = "Formato de e-mail inválido.";
		} else if (formData.email.length > 255) {
			newErrors.email = "E-mail muito longo.";
		}

		// 5. Telefone
		if (!formData.telefone) {
			newErrors.telefone = "Telefone é obrigatório.";
		} else if (formData.telefone.length < 14) {
			// (11) 9999-9999 mínimo
			newErrors.telefone = "Telefone incompleto.";
		}

		// 6. Endereço
		if (!formData.endereco) {
			newErrors.endereco = "Endereço é obrigatório.";
		} else if (formData.endereco.length > 255) {
			newErrors.endereco = "Endereço não pode ter mais de 255 caracteres.";
		}

		setErrors(newErrors);
		// Retorna true se não tiver erros
		return Object.keys(newErrors).length === 0;
	};

	// Função para Abrir o Modal
	const openModal = (paciente = null) => {
		setErrors({}); // Limpa erros anteriores
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

		// Roda a validação antes de enviar
		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
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
				const errorText = await response.text();
				alert("Erro ao salvar: " + errorText); // Mostra erro do backend se houver (ex: CPF duplicado)
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

	const calcularIdade = (data) => {
		if (!data) return "-";
		const hoje = new Date();
		const nasc = new Date(data);
		let idade = hoje.getFullYear() - nasc.getFullYear();
		const m = hoje.getMonth() - nasc.getMonth();
		if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
			idade--;
		}
		return idade + " anos";
	};

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
								<th className='p-4 font-semibold text-gray-600'>
									Nome
								</th>
								<th className='p-4 font-semibold text-gray-600'>CPF</th>
								<th className='p-4 font-semibold text-gray-600'>
									Idade
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
										<br />
										<span className='text-xs text-gray-400'>
											{paciente.email}
										</span>
									</td>
									<td className='p-4 text-gray-600'>{paciente.cpf}</td>
									<td className='p-4 text-gray-600 flex items-center gap-2'>
										<Calendar size={14} />{" "}
										{calcularIdade(paciente.dataNascimento)}
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
					<div className='bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]'>
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

						<form
							onSubmit={handleSubmit}
							className='p-5 space-y-4 overflow-y-auto'>
							{/* NOME */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Nome Completo
								</label>
								<input
									type='text'
									maxLength={255}
									className={`w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 ${
										errors.nome ? "border-red-500" : "border-gray-300"
									}`}
									value={formData.nome}
									onChange={(e) =>
										setFormData({ ...formData, nome: e.target.value })
									}
								/>
								{errors.nome && (
									<p className='text-xs text-red-500 mt-1'>
										{errors.nome}
									</p>
								)}
							</div>

							<div className='grid grid-cols-2 gap-4'>
								{/* CPF */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										CPF
									</label>
									<input
										type='text'
										placeholder='000.000.000-00'
										maxLength={14}
										className={`w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 ${
											errors.cpf
												? "border-red-500"
												: "border-gray-300"
										}`}
										value={formData.cpf}
										onChange={(e) =>
											setFormData({
												...formData,
												cpf: formatCPF(e.target.value),
											})
										}
									/>
									{errors.cpf && (
										<p className='text-xs text-red-500 mt-1'>
											{errors.cpf}
										</p>
									)}
								</div>

								{/* NASCIMENTO */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Nascimento
									</label>
									<input
										type='date'
										className={`w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 ${
											errors.dataNascimento
												? "border-red-500"
												: "border-gray-300"
										}`}
										value={formData.dataNascimento}
										onChange={(e) =>
											setFormData({
												...formData,
												dataNascimento: e.target.value,
											})
										}
									/>
									{errors.dataNascimento && (
										<p className='text-xs text-red-500 mt-1'>
											{errors.dataNascimento}
										</p>
									)}
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								{/* TELEFONE */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Telefone
									</label>
									<input
										type='text'
										maxLength={15}
										placeholder='(00) 00000-0000'
										className={`w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 ${
											errors.telefone
												? "border-red-500"
												: "border-gray-300"
										}`}
										value={formData.telefone}
										onChange={(e) =>
											setFormData({
												...formData,
												telefone: formatPhone(e.target.value),
											})
										}
									/>
									{errors.telefone && (
										<p className='text-xs text-red-500 mt-1'>
											{errors.telefone}
										</p>
									)}
								</div>

								{/* EMAIL */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Email
									</label>
									<input
										type='email'
										maxLength={255}
										className={`w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 ${
											errors.email
												? "border-red-500"
												: "border-gray-300"
										}`}
										value={formData.email}
										onChange={(e) =>
											setFormData({
												...formData,
												email: e.target.value,
											})
										}
									/>
									{errors.email && (
										<p className='text-xs text-red-500 mt-1'>
											{errors.email}
										</p>
									)}
								</div>
							</div>

							{/* ENDEREÇO */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Endereço
								</label>
								<textarea
									className={`w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 ${
										errors.endereco
											? "border-red-500"
											: "border-gray-300"
									}`}
									rows='2'
									maxLength={255}
									value={formData.endereco}
									onChange={(e) =>
										setFormData({
											...formData,
											endereco: e.target.value,
										})
									}></textarea>
								{errors.endereco && (
									<p className='text-xs text-red-500 mt-1'>
										{errors.endereco}
									</p>
								)}
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
