import React, { useState } from 'react';
import styles from './AddDocumentModal.module.scss';
import { CSSTransition } from 'react-transition-group';
import { firestore } from '../lib/firebase';
import 'react-quill/dist/quill.snow.css';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import dynamic from 'next/dynamic';

const ReactQuillNoSSRWrapper = dynamic(() => import('react-quill'), {
	ssr: false,
});

interface AddDocumentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: () => void;
}

export default function AddDocumentModal({
	isOpen,
	onClose,
	onSubmit,
}: AddDocumentModalProps) {
	const [editorContent, setEditorContent] = useState('');
	const [newDocument, setNewDocument] = useState({
		title: '',
		description: '',
		category: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewDocument({
			...newDocument,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const documentData = {
			title: newDocument.title,
			description: editorContent,
			category: newDocument.category,
		};
		handleAddDocument(documentData);
		setEditorContent('');
	};

	const handleAddDocument = async (documentData: {
		title: string;
		description: string;
		category: string;
	}) => {
		try {
			await firestore.collection('documents').add(documentData);
			closeModal();
		} catch (error) {
			console.error('Error saving document:', error);
		}
	};

	const closeModal = () => {
		onClose();
	};

	return (
		<CSSTransition
			in={isOpen}
			timeout={300}
			classNames={{
				enter: styles.modalEnter,
				enterActive: styles.modalEnterActive,
				exit: styles.modalExit,
				exitActive: styles.modalExitActive,
			}}
			unmountOnExit
		>
			<div className={styles.modal}>
				<div className={styles.modalContent}>
					<h2 className={styles.modalTitle}>Add Document</h2>
					<form onSubmit={handleSubmit}>
						<label className={styles.formLabel}>
							Title:
							<input
								className={styles.formInput}
								name="title"
								value={newDocument.title}
								onChange={handleChange}
							/>
						</label>
						<label className={styles.formLabel}>
							Description:
							<ReactQuillNoSSRWrapper
								value={editorContent}
								onChange={setEditorContent}
								modules={{
									toolbar: [
										[
											'bold',
											'italic',
											'underline',
											'strike',
										],
										['link', 'image'],
										[
											{ list: 'ordered' },
											{ list: 'bullet' },
										],
										[{ indent: '-1' }, { indent: '+1' }],
										['clean'],
									],
								}}
								formats={[
									'bold',
									'italic',
									'underline',
									'strike',
									'link',
									'image',
									'list',
									'bullet',
									'indent',
								]}
							/>
						</label>
						<label className={styles.formLabel}>
							Category:
							<input
								className={styles.formInput}
								name="category"
								value={newDocument.category}
								onChange={handleChange}
							/>
						</label>
						<div className={styles.formButtons}>
							<button className={styles.formButton} type="submit">
								Add Document
							</button>
							<button
								className={styles.formButton}
								type="button"
								onClick={closeModal}
							>
								Cancel
							</button>
						</div>
					</form>
					<button
						className={styles.closeButton}
						type="button"
						onClick={closeModal}
					>
						<HighlightOffIcon />
					</button>
				</div>
			</div>
		</CSSTransition>
	);
}
