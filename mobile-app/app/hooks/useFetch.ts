import React, {useEffect, useState} from 'react';

const useFetch = (serviceFunction: Function) => {
  const [records, setRecords] = useState<Array<{}>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await serviceFunction();
        setRecords(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return [records, loading, setRecords, error];
};

export default useFetch;
