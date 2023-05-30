import { useEffect, useState } from 'react';
import { firestore } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';

const ChatPage = () => {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const messagesCollection = collection(firestore, 'messages');
				const snapshot = await getDocs(messagesCollection);
				const messagesData = snapshot.docs.map((doc) => doc.data());
				setMessages(messagesData);
			} catch (error) {
				console.error('Error fetching messages:', error);
			}
		};

		fetchMessages();
	}, []);

	return (
		<div>
			{messages.map((message) => (
				<div key={message.id}>
					<p>{message.timestamp}</p>
					<p>{message.sender}</p>
					<p>{message.content}</p>
					{message.image && (
						<Image
							fill
							src={message.image}
							alt="Attached Image"
							style={{ maxWidth: '100%' }}
						/>
					)}
				</div>
			))}
		</div>
	);
};

export default ChatPage;
