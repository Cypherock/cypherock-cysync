import { BulletContainer } from "./Bullet.styled";

type BulletProps = {
  outline?: Boolean;
  lg?: Boolean;
  gold?: Boolean;
  success?: Boolean;
  failed?: Boolean;
  muted?: Boolean;
};

export const Bullet = ({ ...props }: BulletProps): JSX.Element => {
  return (
    <>
      <BulletContainer {...props} />
    </>
  );
};
