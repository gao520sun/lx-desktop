// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useState } from 'react';

const useUser = () => {
  const [name, setName] = useState<string>(DEFAULT_NAME);
  const [navigate, setNavigate] = useState<any>({});
  const [micNavigate, setMicNavigate] = useState<any>({});
  const [micSLSourceKey, setMicSLSourceKey] = useState<any>('netease');
  return {
    name,
    setName,
    navigate,
    setNavigate,
    micNavigate,
    setMicNavigate,
    micSLSourceKey,
    setMicSLSourceKey
  };
};

export default useUser;
