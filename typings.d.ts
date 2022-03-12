declare module "*.module.less" {
  const styles: {
    readonly [ key: string ]: string
  };

  export default styles;
}
