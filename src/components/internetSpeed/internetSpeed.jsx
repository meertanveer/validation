

import { useState, useEffect } from 'react';

const InternetSpeed = () => {

  const [speed, setSpeed] = useState(null);

  useEffect(() => {
    const imageUrl = 'https://billsahuliyat.jkpdd.net/Images/pddlogo.png'; // A file with CORS enabled

    const measureSpeed = async () => {
      const startTime = Date.now();

      try {
        const response = await fetch(imageUrl, { method: 'GET', cache: 'no-cache' });
        await response.blob(); // Download the image
        const endTime = Date.now();

        const durationInSeconds = (endTime - startTime) / 1000;
        const fileSizeInBits = 139 * 1024 * 8; // Approx 139 KB file size
        const speedMbps = (fileSizeInBits / durationInSeconds / (1024 * 1024)).toFixed(2);

        setSpeed(speedMbps);
      } catch (error) {
        console.error('Error measuring speed:', error);
        setSpeed('Error');
      }
    };

    const interval = setInterval(measureSpeed, 1000); // Update speed every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className='font-bold text-green-500'>
      {speed ? <p> Internet Speed: {speed} Mbps</p> : <p>Testing...</p>}
    </div>
  );
};

export default InternetSpeed;
