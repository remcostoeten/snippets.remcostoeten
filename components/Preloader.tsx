import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Preloader: React.FC = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preloader = preloaderRef.current;

    // Use GSAP to animate the preloader
    //     gsap.to(preloader, { opacity: 0, duration: 1, onComplete: () => {
    //           // Remove the preloader from the DOM after the animation completes
    //                 preloader.remove();
    //                     } });
    //
    //                       }, []);
    //
    //                         return (
    //                             <div
    //                                   ref={preloaderRef}
    //                                         className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white z-50"
    //                                             >
    //                                                   <div className="text-4xl font-bold">Loading...</div>
    //                                                       </div>
    //                                                         );
    //                                                         };
    //
    //                                                         export default Preloader;
    //
