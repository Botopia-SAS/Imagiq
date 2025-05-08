declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      alt?: string;
      ar?: boolean;
      'ar-modes'?: string;
      'environment-image'?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      style?: React.CSSProperties;
      slot?: string;
    };
  }
}
