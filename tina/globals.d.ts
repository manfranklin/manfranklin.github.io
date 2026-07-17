declare module "tinacms" {
  export function defineConfig(config: any): any;
}

declare const process: {
  env: { [key: string]: string | undefined };
};

