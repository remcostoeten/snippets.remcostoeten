import React from 'react';
import Image from 'next/image';

export default function loginAside() {
	return (
		<aside className="asideLogin  wrapper xl:w-1/5 bg-dark-purple rounded-tr-3xl h-screen pl-6 pt-12 flex flex-col">
			<div className="h-1/3  text-9xl">
				<h1 className="h-1/3 pr-8 text-xl text-offWhite p-9 pl-6 pt-6">
					olah. why not just login? it`s super easy nowdays with
					username and password, google or discord.
				</h1>
			</div>
			<div className="flex relative shapes -right-16">
				<Image
					src="/authentication/pinkoval.png"
					alt="Remco Stoeten login page"
					width={256}
					height={160}
					className="shapes__four shape shapes"
				/>
				<Image
					src="/authentication/ball.png"
					alt="Remco Stoeten login page"
					width={235}
					height={235}
					className="shapes__two shape"
				/>
			</div>
			<div className="flex relative shape right-16">
				<Image
					src="/authentication/triangle.png"
					alt="Remco Stoeten login page"
					width={74}
					height={79}
					className="shapes__three shape"
				/>
				<Image
					src="/authentication/shapes.png"
					alt="Remco Stoeten login page"
					width={524}
					height={503}
					className="shapes__one shape right-4"
				/>
			</div>
		</aside>
	);
}
