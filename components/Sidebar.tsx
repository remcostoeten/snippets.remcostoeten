import React, { useState } from 'react';
import ColorSwitcher from './ui-elements/ColorSwitcher';
import Link from 'next/link';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from '@mui/icons-material/Home';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AddDocumentModal from './AddDocumentModal';
import DashboardIcon from '@mui/icons-material/Dashboard';
export default function Sidebar() {
	const [isSidebarExpanded, setSidebarExpanded] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [documents, setDocuments] = useState<Document[]>([]);

	const anchorStyling: string =
		'flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300 	';

	const toggleSidebar: () => void = () => {
		setSidebarExpanded(!isSidebarExpanded);
	};

	const openModal: () => void = () => {
		setIsModalOpen(true);
	};

	const closeModal: () => void = () => {
		setIsModalOpen(false);
	};

	const handleAddDocument: (newDocument: Document) => void = (
		newDocument: Document,
	) => {
		setDocuments([...documents, newDocument]);
	};

	return (
		<>
			<div
				className={`sidebar h-full flex flex-col bg-gray-900 ${
					isSidebarExpanded ? 'expanded' : ''
				}`}
				onMouseEnter={toggleSidebar}
				onMouseLeave={toggleSidebar}
			>
				<div className="w-full px-2">
					<div className="flex flex-col items-center h-full w-full mt-3 ">
						<Link className={anchorStyling} href="/">
							<HomeIcon />

							<span
								className={`ml-2 text-sm menu-text font-medium ${
									isSidebarExpanded ? 'flex' : 'hidden'
								}`}
							>
								Dashboard
							</span>
						</Link>
						<Link href="/tests/diary" className={anchorStyling}>
							<svg
								className={`w-6 h-6 stroke-current ${
									isSidebarExpanded ? 'mr-2' : 'mr-2'
								}`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<span
								className={`ml-2 text-sm menu-text font-medium ${
									isSidebarExpanded ? 'flex' : 'hidden'
								}`}
							>
								Search
							</span>
						</Link>

						<Link href="/todos" className={anchorStyling}>
							<PlaylistAddCheckIcon />
							<span
								className={`ml-2 text-sm menu-text font-medium ${
									isSidebarExpanded ? 'flex' : 'hidden'
								}`}
							>
								Todos
							</span>
						</Link>

						<Link href="/tests" className={anchorStyling}>
							<DashboardIcon />
							<span
								className={`ml-2 text-sm menu-text font-medium ${
									isSidebarExpanded ? 'flex' : 'hidden'
								}`}
							>
								Dashboard
							</span>
						</Link>

						<Link href="#" className={anchorStyling}>
							<svg
								className={`w-6 h-6 stroke-current ${
									isSidebarExpanded ? 'mr-2' : 'mr-2'
								}`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
								/>
							</svg>
							<span
								className={`ml-2 text-sm menu-text font-medium ${
									isSidebarExpanded ? 'flex' : 'hidden'
								}`}
							>
								Docs
							</span>
						</Link>
						<Link
							href="#"
							className="flex items-center justify-center w-16 h-16 mt-auto bg-gray-800 hover:bg-gray-700 hover:text-gray-300"
							onClick={openModal}
						>
							<AddCircleIcon />
						</Link>

						<Link href="#" className={anchorStyling}>
							<ColorSwitcher />
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
