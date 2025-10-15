import {useEffect, useState} from 'react';

const usePagination = (
  pageSize: number,
  initPageNumber: number,
  paginationService: Function,
) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pageNo, setPageNo] = useState<number>(initPageNumber);
  const [endReached, setEndReached] = useState<boolean>(false);
  const [data, setData] = useState<Array<{}>>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const {data} = await paginationService(pageNo, pageSize);
        setData(data);
        if (data.length < pageSize) setEndReached(true);
        else if (endReached) setEndReached(false);
      } catch (e) {
        console.log(e);
      }

      setLoading(false);
    };

    fetchData();
  }, [pageNo]);

  const onBeforeReachEnd = () => {
    if (endReached) return;
    else {
      setPageNo(prev => prev + 1);
    }
  };

  return {
    data,
    endReached,
    loading,
    onBeforeReachEnd,
    pageNo,
  };
};

export type paginationType = {
  data: Array<{}>;
  endReached: boolean;
  loading: boolean;
  onBeforeReachEnd: Function;
  pageNo: number;
};

export default usePagination;
