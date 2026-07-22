declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string
          alt?: string
          'camera-controls'?: boolean
          'auto-rotate'?: boolean
          'rotation-per-second'?: string
          'disable-zoom'?: boolean
          'camera-orbit'?: string
          'environment-image'?: string
          exposure?: string
          'shadow-intensity'?: string
          'shadow-softness'?: string
          poster?: string
          loading?: 'auto' | 'lazy' | 'eager'
          reveal?: 'auto' | 'interaction' | 'manual'
        },
        HTMLElement
      >
    }
  }
}

export {}
