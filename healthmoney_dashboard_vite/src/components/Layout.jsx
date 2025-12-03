import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

function getActivePage(pathname) {
	if (pathname === "/") return "dashboard";
	if (pathname.startsWith("/pacientes")) return "pacientes";
	if (pathname.startsWith("/agenda")) return "agenda";
	if (pathname.startsWith("/notas")) return "notas";
	if (pathname.startsWith("/relatorios")) return "relatorios";
	return "dashboard";
}

export default function Layout() {
	const location = useLocation();
	const [activePage, setActivePage] = useState(
		getActivePage(location.pathname)
	);

	useEffect(() => {
		setActivePage(getActivePage(location.pathname));
	}, [location.pathname]);

	return (
		<div className='bg-gray-50 font-sans'>
			<Sidebar activePage={activePage} />

			<Outlet />
		</div>
	);
}
