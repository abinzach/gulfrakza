import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video Container */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/video-poster.jpg"
      >
        <source src="/videos/hero-video.webm" type="video/webm" />
        <source src="https://ik.imagekit.io/l3eswz12s/Gulf%20Rakza/hero_vid?updatedAt=1739108938597" type="video/mp4" />
        {/* Fallback text if video can’t load */}
        Your browser does not support the video tag.
      </video>

      {/* Overlay for Darkening the Background */}
      <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true"></div>

      {/* Content Over the Video */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4"><span className='font-light'>Connecting</span> Markets<span className='font-light'>, Empowering</span>  Growth</h1>
        <p className="text font-raleway md:text-lg max-w-2xl mb-6">
          At Gulf Rakza, we specialize in top-quality industrial supplies and turnkey solutions to keep your operations running smoothly.
        </p>
        <div className="space-x-4">
          <InteractiveHoverButton/>
        
          <button
            
            className="inline-block px-6 py-3  text-white rounded-full border-2  font-medium hover:bg-black transition-all duration-300"
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
