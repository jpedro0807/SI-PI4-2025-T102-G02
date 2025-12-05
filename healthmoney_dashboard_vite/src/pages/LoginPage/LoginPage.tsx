import React from "react";
import { Activity } from "lucide-react"; // Ícone que lembra saúde/finanças

export default function LoginPage() {
	// Função que inicia o fluxo de login com Google via backend (Spring Security)
	const handleGoogleLogin = () => {
		// Redireciona o usuário para a rota de login do backend
		// Aqui está apontando diretamente para o backend em http://localhost:8080/login
		// (poderia ser /login se estivesse passando por um proxy no front)
		window.location.href = "http://localhost:8080/login";
	};

	return (
		<div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			{/* Cabeçalho com logo e título do sistema */}
			<div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
				<div className='flex justify-center items-center gap-2 mb-6'>
					{/* “Logo” simples usando ícone Activity dentro de um card verde */}
					<div className='w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center'>
						<Activity size={32} className='text-emerald-600' />
					</div>
				</div>
				<h2 className='text-3xl font-extrabold text-gray-900'>
					Health Money
				</h2>
				<p className='mt-2 text-sm text-gray-600'>
					Gestão financeira inteligente para sua clínica
				</p>
			</div>

			{/* Card de Login centralizado */}
			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='bg-white py-8 px-4 shadow-xl shadow-gray-100 sm:rounded-xl sm:px-10 border border-gray-100'>
					<div className='space-y-6'>
						<div>
							<h3 className='text-lg font-medium text-gray-900 text-center mb-6'>
								Acesse sua conta
							</h3>

							{/* Botão principal de login com Google */}
							<button
								onClick={handleGoogleLogin}
								className='w-full flex justify-center items-center gap-3 px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all'>
								{/* Ícone do Google em SVG (estático, sem dependência externa) */}
								<svg className='h-5 w-5' viewBox='0 0 24 24'>
									<path
										d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
										fill='#4285F4'
									/>
									<path
										d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
										fill='#34A853'
									/>
									<path
										d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
										fill='#FBBC05'
									/>
									<path
										d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
										fill='#EA4335'
									/>
								</svg>
								Continuar com Google
							</button>
						</div>

						{/* Separador visual com texto informativo sobre segurança/OAuth */}
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-200' />
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>
									Acesso seguro via OAuth2
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Rodapé da tela de login */}
				<p className='mt-6 text-center text-xs text-gray-400'>
					&copy; 2025 Health Money. Todos os direitos reservados.
				</p>
			</div>
		</div>
	);
}
