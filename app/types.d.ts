declare module 'markmap-lib' {
  interface INode {
    type: string;
    depth: number;
    payload?: any;
    content: string;
    children?: INode[];
  }

  interface ITransformResult {
    root: INode;
    features: {
      linkify: boolean;
      katex: boolean;
    };
  }

  export class Transformer {
    transform(markdown: string): ITransformResult;
  }
}

declare module 'markmap-view' {
  import { INode } from 'markmap-lib';
  
  interface IMarkmapOptions {
    // 这里可以添加options的具体类型
  }
  
  export class Markmap {
    static create(
      svg: SVGElement | string, 
      options: IMarkmapOptions | null, 
      data: any
    ): Markmap;
    
    constructor(svg: SVGElement | string, opts?: any);
    setData(data: any): void;
    renderData(data: INode): void;
    render(): void;
    fit(): void;
  }
} 