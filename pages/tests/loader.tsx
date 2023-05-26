import React, { useEffect, useRef } from 'react';
import styles from '@/components/ui-elements/Preloader.module.scss';

const Preloader: React.FC = () => {
	return (
		<div className={styles.container}>
			<span className={styles.tileOne}></span>
			<span className={styles.tileTwo}></span>
			<span className={styles.tileThree}></span>
			<span className={styles.tileFour}></span>
		</div>
	);
};

export default Preloader;
