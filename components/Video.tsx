'use client';

import React from 'react';

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  playsInline?: boolean;
}

const Video: React.FC<VideoProps> = ({ src, playsInline, className, style, ...props }) => {
  return (
    <div className="my-6 w-full">
      <video
        src={src}
        playsInline={playsInline}
        controls
        className={className}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          borderRadius: '0.5rem',
          ...style,
        }}
        {...props}
      >
        <track kind="captions" srcLang="" label="" src="" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;

