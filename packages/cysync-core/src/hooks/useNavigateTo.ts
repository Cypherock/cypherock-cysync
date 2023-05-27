import { useNavigate } from 'react-router-dom';
import { sleep } from '@cypherock/cysync-utils';

export const useNavigateTo = () => {
  const navigate = useNavigate();

  return async (route: string, delay?: number) => {
    if (delay) await sleep(delay);
    navigate(route);
  };
};
