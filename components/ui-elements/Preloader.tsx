import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Preloader.module.scss';

const Preloader: React.FC = () => {
	const preloaderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const preloader = preloaderRef.current;
		const tiles = preloader.querySelectorAll('span');

		gsap.to(tiles, {
			yoyo: true,
			repeat: -1,
			ease: 'power1.inOut',
			stagger: 0.2,
			opacity: 0.2,
		});

		gsap.to(preloader, {
			opacity: 0,
			duration: 1,
			delay: 2,
			onComplete: () => {
				// Remove the preloader from the DOM after the animation completes
				preloader.remove();
			},
		});
	}, []);

	const preLoaderAnimation = (
		<div className={styles.container} ref={preloaderRef}>
			<span className={styles.tileOne}></span>
			<span className={styles.tileTwo}></span>
			<span className={styles.tileThree}></span>
			<span className={styles.tileFour}></span>
		</div>
	);

	return <>{preLoaderAnimation}</>;
};

export default Preloader;
