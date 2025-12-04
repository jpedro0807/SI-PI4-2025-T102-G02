import React, { useEffect, useState } from "react";
import {
	TrendingUp,
	TrendingDown,
	DollarSign,
	BarChart3,
	Download,
} from "lucide-react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";

import * as XLSX from "xlsx";
// Cores para os gráficos
const COLORS_REC = ["#10b981", "#34d399", "#6ee7b7"]; // Tons de Verde
const COLORS_DESP = ["#ef4444", "#f87171", "#fca5a5"]; // Tons de Vermelho

export default function RelatoriosPage() {
	const [dados, setDados] = useState(null);
	const [loading, setLoading] = useState(true);
	const [mesSelecionado, setMesSelecionado] = useState(
		new Date().getMonth() + 1
	);

	useEffect(() => {
		fetchRelatorio();
	}, [mesSelecionado]);

	const fetchRelatorio = async () => {
		try {
			const response = await fetch(
				`/api/relatorios/mensal?mes=${mesSelecionado}&ano=2025`
			);

			if (response.status === 401) {
				console.warn("Sessão expirada. Redirecionando...");
				window.location.href = "/login";
				return;
			}

			const json = await response.json();
			setDados(json);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleExportar = () => {
		if (!dados) return;

		// 1. Criar um Workbook (Arquivo Excel) vazio
		const wb = XLSX.utils.book_new();

		// 2. Criar Aba 1: RESUMO GERAL
		const resumoData = [
			{ Indicador: "Mês de Referência", Valor: `${mesSelecionado}/2025` },
			{ Indicador: "Receita Total", Valor: dados.receitaTotal },
			{ Indicador: "Despesas Totais", Valor: dados.despesasTotais },
			{ Indicador: "Saldo Final", Valor: dados.saldo },
			{ Indicador: "A Receber", Valor: dados.aReceber },
		];
		const wsResumo = XLSX.utils.json_to_sheet(resumoData);

		// Ajuste de largura das colunas (Opcional, para ficar bonito)
		wsResumo["!cols"] = [{ wch: 25 }, { wch: 15 }];

		XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo Geral");

		// 3. Criar Aba 2: DETALHE RECEITAS
		const receitasData = dados.receitasPorCategoria.map((item) => ({
			Categoria: item.nome,
			Valor: item.valor,
		}));
		const wsReceitas = XLSX.utils.json_to_sheet(receitasData);
		wsReceitas["!cols"] = [{ wch: 30 }, { wch: 15 }];
		XLSX.utils.book_append_sheet(wb, wsReceitas, "Detalhe Receitas");

		// 4. Criar Aba 3: DETALHE DESPESAS
		const despesasData = dados.despesasPorCategoria.map((item) => ({
			Categoria: item.nome,
			Valor: item.valor,
		}));
		const wsDespesas = XLSX.utils.json_to_sheet(despesasData);
		wsDespesas["!cols"] = [{ wch: 30 }, { wch: 15 }];
		XLSX.utils.book_append_sheet(wb, wsDespesas, "Detalhe Despesas");

		// 5. Baixar o arquivo
		XLSX.writeFile(wb, `Relatorio_Financeiro_${mesSelecionado}_2025.xlsx`);
	};

	if (loading) return <div className='p-8'>Carregando relatórios...</div>;
	if (!dados) return <div className='p-8'>Sem dados.</div>;

	return (
		<main className='flex-1 ml-64 p-8 bg-gray-50 min-h-screen'>
			{/* HEADER */}
			<header className='flex justify-between items-center mb-8'>
				<div>
					<h2 className='text-3xl font-bold text-gray-900'>
						Relatórios Financeiros
					</h2>
					<p className='text-gray-500 mt-1'>
						Análise de receitas e despesas
					</p>
				</div>

				<div className='flex gap-3'>
					<select
						className='bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-emerald-200'
						value={mesSelecionado}
						onChange={(e) => setMesSelecionado(e.target.value)}>
						<option value='1'>Janeiro</option>
						<option value='2'>Fevereiro</option>
						<option value='3'>Março</option>
						<option value='4'>Abril</option>
						<option value='12'>Dezembro</option>
					</select>

					<button
						onClick={() => handleExportar()}
						className='flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors'>
						<Download size={18} /> Exportar
					</button>
				</div>
			</header>

			{/* CARDS DE RESUMO */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
				<RelatorioCard
					title='Receita Total'
					value={dados.receitaTotal}
					icon={TrendingUp}
					color='emerald'
				/>
				<RelatorioCard
					title='Despesas Totais'
					value={dados.despesasTotais}
					icon={TrendingDown}
					color='red'
				/>
				<RelatorioCard
					title='Saldo'
					value={dados.saldo}
					icon={DollarSign}
					color='blue'
				/>
				<RelatorioCard
					title='A Receber'
					value={dados.aReceber}
					icon={BarChart3}
					color='yellow'
				/>
			</div>

			{/* ÁREA DOS GRÁFICOS */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* GRÁFICO DE RECEITAS */}
				<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
					<h3 className='font-bold text-gray-800 mb-6'>
						Receitas por Categoria
					</h3>
					<div className='h-[300px] w-full'>
						{dados.receitaTotal > 0 ? (
							<ResponsiveContainer width='100%' height='100%'>
								<PieChart>
									<Pie
										data={dados.receitasPorCategoria}
										cx='50%'
										cy='50%'
										innerRadius={60}
										outerRadius={80}
										paddingAngle={5}
										dataKey='valor'>
										{dados.receitasPorCategoria.map(
											(entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														COLORS_REC[index % COLORS_REC.length]
													}
												/>
											)
										)}
									</Pie>
									<Tooltip
										formatter={(value) => `R$ ${value.toFixed(2)}`}
									/>
									<Legend verticalAlign='bottom' height={36} />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className='h-full flex items-center justify-center text-gray-400'>
								Sem receitas neste mês
							</div>
						)}
					</div>
				</div>

				{/* GRÁFICO DE DESPESAS */}
				<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
					<h3 className='font-bold text-gray-800 mb-6'>
						Despesas por Categoria
					</h3>
					<div className='h-[300px] w-full'>
						{dados.despesasTotais > 0 ? (
							<ResponsiveContainer width='100%' height='100%'>
								<PieChart>
									<Pie
										data={dados.despesasPorCategoria}
										cx='50%'
										cy='50%'
										innerRadius={60}
										outerRadius={80}
										paddingAngle={5}
										dataKey='valor'>
										{dados.despesasPorCategoria.map(
											(entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														COLORS_DESP[
															index % COLORS_DESP.length
														]
													}
												/>
											)
										)}
									</Pie>
									<Tooltip
										formatter={(value) => `R$ ${value.toFixed(2)}`}
									/>
									<Legend verticalAlign='bottom' height={36} />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className='h-full flex items-center justify-center text-gray-400'>
								Sem despesas registradas
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}

// Componente Card Auxiliar
function RelatorioCard({ title, value, icon: Icon, color }) {
	const colorClasses = {
		emerald: "bg-emerald-50 text-emerald-600",
		red: "bg-red-50 text-red-600",
		blue: "bg-blue-50 text-blue-600",
		yellow: "bg-yellow-50 text-yellow-600",
	};

	return (
		<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
			<div className='flex justify-between items-start'>
				<div>
					<p className='text-sm font-medium text-gray-500 mb-1'>{title}</p>
					<h3 className='text-2xl font-bold text-gray-900'>
						R$ {value ? value.toFixed(2) : "0.00"}
					</h3>
				</div>
				<div className={`p-3 rounded-lg ${colorClasses[color]}`}>
					<Icon size={24} />
				</div>
			</div>
		</div>
	);
}
