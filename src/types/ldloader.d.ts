declare module "ldloader" {
  interface LdLoaderOptions {
    root?: string | Element | Element[] | NodeList | null;
    container?: string | Element | Element[] | NodeList | null;
    activeClass?: string;
    inactiveClass?: string;
    className?: string;
    baseZ?: number;
    autoZ?: boolean;
    atomic?: boolean;
    toggler?: (on: boolean) => void;
    ctrl?: {
      init?: (this: Element) => void;
      step: (this: Element, t: number) => void;
      done?: (this: Element, t: number) => void;
    };
  }

  class LdLoader {
    constructor(opt?: LdLoaderOptions);
    on(delay?: number): Promise<void>;
    off(delay?: number, force?: boolean): Promise<void>;
    toggle(v?: boolean, delay?: number, force?: boolean): Promise<void>;
    flash(duration?: number, delay?: number): Promise<void>;
    cancel(v?: boolean): void;
    isOn(): boolean;
  }

  export default LdLoader;
}

declare module "ldloader/index.css";
