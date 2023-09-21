declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

declare module '*.css' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.sass' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.scss' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.less' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.styl' {
  const style: { [key: string]: string };

  export default style;
}

declare module '*.png' {
  const url: string;

  export default url;
}

declare module '*.jpg' {
  const url: string;

  export default url;
}

declare module '*.jpeg' {
  const url: string;

  export default url;
}

declare module '*.gif' {
  const url: string;

  export default url;
}

declare module '*.webp' {
  const url: string;

  export default url;
}
declare module '*.mp4' {
  const url: string;

  export default url;
}
declare module '*.mp3' {
  const url: string;

  export default url;
}

