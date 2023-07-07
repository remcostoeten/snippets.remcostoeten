import React from 'react';

export default function Authentication() {
	const signInWithGoogle = async () => {
		await auth.signInWithPopup(googleAuthProvider);
	};

	return <div></div>;
}
