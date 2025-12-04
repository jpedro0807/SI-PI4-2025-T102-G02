import React from "react";

export default function DashboardCard({
	title,
	value,
	subtitle,
	iconBg,
	icon,
}) {
	return (
		<div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-start hover:shadow-md transition-shadow'>
			<div className='flex flex-col'>
				<span className='text-gray-500 text-sm font-medium mb-1'>
					{title}
				</span>
				<h3 className='text-2xl font-bold text-gray-800'>{value}</h3>
				{subtitle && (
					<span className='text-xs text-gray-400 mt-2 font-medium block'>
						{subtitle}
					</span>
				)}
			</div>
			<div
				className={`p-3 rounded-xl flex items-center justify-center ${iconBg}`}>
				{React.cloneElement(icon, { size: 24 })}
			</div>
		</div>
	);
}
