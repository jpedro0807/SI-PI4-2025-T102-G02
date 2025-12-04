import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import PacientesPage from "./pages/Pacientes/PacientesPage";
import AgendaPage from "./pages/Agenda/AgendaPage";
import NotasFiscaisPage from "./pages/NotasFiscais/NotasFiscaisPage";
import RelatoriosPage from "./pages/Relatorios/RelatoriosPage";

export default function App() {
	return (
		<Routes>
			<Route path='/login' element={<LoginPage />} />
			<Route path='/' element={<Layout />}>
				<Route index element={<DashboardPage />} />
				<Route path='pacientes' element={<PacientesPage />} />
				<Route path='agenda' element={<AgendaPage></AgendaPage>} />
				<Route
					path='notas'
					element={<NotasFiscaisPage></NotasFiscaisPage>}
				/>
				<Route path='relatorios' element={<RelatoriosPage />} />
			</Route>
		</Routes>
	);
}
