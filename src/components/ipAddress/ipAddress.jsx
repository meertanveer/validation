import { useEffect, useState } from 'react';

const MyIpAddress = () => {
  const [ip, setIp] = useState('');

  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    getIpAddress();
  }, []);

  return (
    <div className='flex itesm-center text-red-600 gap-2'>
      <span>Your IP Address: </span>
      <p className=' font-bold '>{ip}</p>
    </div>
  );
};

export default MyIpAddress;
