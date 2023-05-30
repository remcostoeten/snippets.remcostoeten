import React, { useEffect } from 'react';

const Preloader: React.FC = () => {
	useEffect(() => {
		document.body.classList.add('loader');
		const timeoutId = setTimeout(() => {
			document.body.classList.add('animationPartTwo');
		}, 2000);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	return (
		<>
			<div className="logo">
				<h2 className="logo__text">
					<span className="r">r</span>
					<span className="e">e</span>
					<span className="m">m</span>
					<span className="c">c</span>
					<span className="o">o</span>
					<span className="s">s</span>
					<span className="t">t</span>
					<span className="oo">o</span>
					<span className="ee">e</span>
					<span className="tt">t</span>
					<span className="eee">e</span>
					<span className="n">n</span>
				</h2>
				<svg
					id="Layer_1"
					data-name="Layer 1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 84.51 86.13"
				>
					<g transform="translate(42.255, 43.065)">
						<path
							className="cls-1 logo__right"
							d="m1.895,-14.625c2.83,-4.47 5.01,-9.29 6.48,-14.34 5.95,12.76 18.89,21.64 33.87,21.64v13h-.12c-20.59,0-37.35,16.78-37.35,37.41h-12.98c-.04,-18.85 10.32,-35.3 25.66,-43.94 -6.11,-3.47 -11.42,-8.16 -15.57,-13.76Z"
						></path>
						<path
							className="cls-1 logo__left"
							d="m-8.33,28.785c-5.76,-12.22 -17.89,-20.82 -32.1,-21.46 -.57,0.02 -1.13,0.02 -1.72,0.02v-13.07c.57,0 1.15,0.02 1.72,0.02 9.33,-0.41 18.05,-4.23 24.7,-10.89 7.06,-7.06 10.93,-16.47 10.93,-26.46h13c0,13.46 -5.23,26.11 -14.75,35.63 -3.26,3.28 -6.89,6.03 -10.79,8.25 6.07,3.45 11.36,8.14 15.51,13.7 -2.79,4.39 -5,9.17 -6.5,14.26Z"
						></path>
					</g>
				</svg>
			</div>
		</>
	);
};

export default Preloader;
