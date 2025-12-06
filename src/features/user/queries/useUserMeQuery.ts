import { useQuery } from '@tanstack/react-query';
import type { User } from '../types/user.types';
import { USER_QUERY_KEYS } from './user.queryKeys';
import { fetchUserMe } from '../api/user.api';

export const useUserMeQuery = () => {
  return useQuery<User>({
    queryKey: USER_QUERY_KEYS.me,
    queryFn: fetchUserMe,
  });
};
