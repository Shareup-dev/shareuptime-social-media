import {useState} from 'react';

export default useIsReachable = () => {
  //   const [isReachable, setIsReachable] = useState(false);

  const checkIfReachable = async url => {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(reject, 5000, 'Request timed out');
    });

    const request = fetch(url);

    try {
      const response = await Promise.race([timeout, request]);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {checkIfReachable};
};
