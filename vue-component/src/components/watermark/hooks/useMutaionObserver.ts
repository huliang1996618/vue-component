import { watch, type Ref, unref, type ComponentPublicInstance, getCurrentScope, onScopeDispose } from "vue";

export type MaybeRef<T> = T | Ref<T>;


export interface MutationObserverOptions extends MutationObserverInit {
  window?: Window;
}

export type Fn = () => void;


export const defaultWindow = typeof window !== 'undefined' ? window : undefined;

/**
 * 
 * @param elRef 
 * @returns 
 * @description 
 * 这个函数的作用是获取一个 Vue 组件实例的根 DOM 元素。
函数 `unrefElement` 接收一个名为 `elRef` 的参数，该参数可以是一个 Vue 组件实例的 `ref` 对象，或一个普通的 DOM 元素。
该函数首先使用 `unref` 函数去除 `elRef` 中的响应式引用，得到一个普通的 DOM 元素或 Vue 组件实例。如果 `elRef` 是一个 Vue 组件实例，那么该函数会尝试获取该组件的根 DOM 元素（`$el`），如果没有根 DOM 元素，则直接返回该组件实例。
如果 `elRef` 是一个普通的 DOM 元素，那么函数会直接返回该元素。
 */
export function unrefElement<T extends any>(
  elRef: MaybeRef<T>
): any {
  const plain = unref(elRef);
  return (plain as ComponentPublicInstance)?.$el ?? plain;
}


export function tryOnScopeDispose(fn: any): boolean {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}

export function useMutationObserver(
  target: MaybeRef<any>,
  callback: MutationCallback,
  options: MutationObserverOptions = {}
) {
  const { window = defaultWindow, ...mutationOptions } = options;
  const isSupported = window && 'MutationObserver' in window;
  let observer: MutationObserver | undefined;

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = undefined;
    }
  };

  const stopWatch = watch(
    () => unrefElement(target),
    (el) => {
      cleanup();

      if (isSupported && window && el) {
        observer = new MutationObserver(callback);
        observer.observe(el, mutationOptions);
      }
    },
    { immediate: true }
  );

  const stop = () => {
    cleanup();
    stopWatch();
  };

  return {
    isSupported,
    stop,
  };
}