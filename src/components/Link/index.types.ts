export type LinkProps = {
  inline?: boolean;
  target?: string;
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: React.MouseEventHandler;
  replace?: boolean;
};
