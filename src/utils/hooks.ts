import { useRef, useEffect } from 'react';

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-06-19 16:05:04
 * @LastEditTime: 2021-02-21 21:40:13
 * @Description: file content
 */
export const useRefVal = <T>(value: T): React.MutableRefObject<T> => {
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  return valueRef;
};

export default useRefVal

// export const useRefObj = <T>(obj: T): React.MutableRefObject<T> => {
//   const refObj = useRef(obj);
//   useEffect(() => {
//     refObj.current = obj;
//   }, [...Object.values(obj), obj]);
//   return refObj;
// };
