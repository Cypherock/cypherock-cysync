import { BulletStyle, BulletProps } from "./Bullet.styled";

export const Bullet = ({ ...props }: BulletProps): JSX.Element => {
  return <BulletStyle {...props} />;
};
