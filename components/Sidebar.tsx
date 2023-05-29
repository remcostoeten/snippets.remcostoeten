import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
	AddCircle as AddCircleIcon,
	Home as HomeIcon,
	PlaylistAddCheck as PlaylistAddCheckIcon,
	SpeakerNotes as SpeakerNotesIcon,
	Dashboard as DashboardIcon,
} from '@mui/icons-material';
import ColorSwitcher from './ui-elements/ColorSwitcher';
import LogoIcon from './ui-elements/LogoIcon';

export default function Sidebar() {
	const [isSidebarExpanded, setSidebarExpanded] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [documents, setDocuments] = useState<Document[]>([]);

	const anchorStyling: string =
		'flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300 	';

	const toggleSidebar: () => void = () => {
		setSidebarExpanded(!isSidebarExpanded);
	};

	useEffect(() => {
		document.body.classList.toggle('sidebar-expanded', isSidebarExpanded);
	}, [isSidebarExpanded]);

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
				onMouseEnter={() => setSidebarExpanded(true)}
				onMouseLeave={() => setSidebarExpanded(false)}
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

						<Link href="/todos" className={anchorStyling}>
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

						<Link href="/diary" className={anchorStyling}>
							<SpeakerNotesIcon />
							<span
								className={`ml-2 text-sm menu-text font-medium ${
									isSidebarExpanded ? 'flex' : 'hidden'
								}`}
							>
								Diary
							</span>
						</Link>
						<Link
							href="#"
							className="flex items-center justify-center w-16 h-16 mt-auto bg-gray-800 hover:bg-gray-700 hover:text-gray-300"
							onClick={openModal}
						>
							<AddCircleIcon />
						</Link>
						<Link href="test/logo">
							<LogoIcon />
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
