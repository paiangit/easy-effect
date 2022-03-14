import { useEffect, useRef } from 'react';

export default function useDocumentTitle(
  title: string,
  keepOnUnmount: boolean = true
) {
  // useRef(xxx).current可以在组件的整个生命周期中保证这个值是xxx传入useRef时的初始值，可以免受xxx更新带来的影响
  const oldTitle = useRef(document.title).current;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    // 组件卸载时恢复原来的title
    return () => {
      // 如果useEffect的第二个参数不指定依赖，因为闭包的关系，
      // oldTitle还是第一次执行const oldTitle = document.title所获得的document.title的值；
      // 如果useEffect的第二个参数指定了oldTitle这个依赖，就会一旦oldTitle发生变化，
      // 就重新执行这里的代码，从而使得document.title获得更新
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [oldTitle, keepOnUnmount]);
}
