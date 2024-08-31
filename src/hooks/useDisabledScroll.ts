import { useState } from 'react';

export function useDisabledScroll(isOpen: boolean) {
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);

    if (typeof window !== 'undefined') {
      const body = document.querySelector('body');
      const html = document.documentElement;

      if (body && html) {
        const scrollBarWidth = window.innerWidth - (body?.clientWidth || 0);
        const offsetY = !prevIsOpen
          ? window.scrollY
          : -parseInt(body?.style?.top, 10);

        if (isOpen) {
          body.style.position = 'fixed';
          body.style.top = `-${offsetY}px`;
          body.style.width = `calc(100% - ${scrollBarWidth}px)`;
        } else {
          body.style.position = '';
          body.style.top = '';
          body.style.width = '';

          html.scrollTop = offsetY;
          body.scrollTop = offsetY;
        }
      }
    }
  }
}
