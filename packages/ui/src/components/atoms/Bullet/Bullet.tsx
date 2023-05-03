import React, { ReactElement } from 'react';
import { BulletStyle, BulletProps } from './Bullet.styled';

export const Bullet = ({ ...props }: BulletProps): ReactElement => (
  <BulletStyle {...props} />
);
