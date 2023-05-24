import React from 'react';

type LoaderProps = {
	show: boolean;
};

export default function Loader({ show }: LoaderProps) {
	return show ? <div className="loader"></div> : null;
}
