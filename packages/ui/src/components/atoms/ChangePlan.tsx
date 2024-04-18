import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import {
  upgrade,
  upgradeHover,
  downgrade as downgradeImage,
} from '../../assets';

const UpgradeDefaultImage = styled.img.attrs({
  src: upgrade,
  alt: 'edit',
})``;

const UpgradetHoverImage = styled.img.attrs({
  src: upgradeHover,
  alt: 'edit hover',
})``;

const DowngradeImage = styled.img.attrs({
  src: downgradeImage,
  alt: 'edit hover',
  width: '43px',
  height: '40px',
})``;

export interface ChangePlanProps {
  downgrade: boolean;
}

export const ChangePlan: FC<ChangePlanProps> = ({ downgrade }) => {
  const [isHover, setIsHover] = useState(false);
  // const [isselected, setisSelected] = useState(false);
  const downgradeHover = 'Some features will not work anymore';
  const downgradeDefault = 'Downgrade to Silver plan with less features';
  // const upgradeHover = 'Enjoy more benefits and better asset transfer';
  const upgradeDefault = 'Upgrade to Gold plan with more features';
  const DowngradeContainer = styled.div`
    width: 220px;
    height: 220px;
    box-sizing: border-box;
    align-items: center;
    padding: 24px 24px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    background: ${isHover ? '#333130' : '#2A2827'};
    font-family: Poppins;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    text-align: center;
  `;

  const UpgradeContaoner = styled.div`
    width: 290px;
    height: 84px;
    padding: 24px;
    border-radius: 8px;
    box-sizing: border-box;
    align-items: center;
    display: flex;
    justify-content: space-between;
    background: #2a2827;
  `;

  const Label = styled.div`
    background: linear-gradient(
      90deg,
      #a2adb3 1.67%,
      #f3f1f2 35.99%,
      #bcc3c9 66.2%,
      #dcdfe4 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: linear-gradient(
      90deg,
      #a2adb3 1.67%,
      #f3f1f2 35.99%,
      #bcc3c9 66.2%,
      #dcdfe4 100%
    );
  `;

  const UpgradeLabel = styled.div`
    width: 192px;
    font-family: Poppins;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    text-align: left;
    margin-left: 25px;
    background: ${isHover
      ? 'linear-gradient(90deg, #E9B873 0.19%, #FEDD8F 37.17%, #B78D51 100.19%)'
      : '#8B8682'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `;
  return downgrade ? (
    <DowngradeContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <DowngradeImage />
      <Label>{isHover ? downgradeHover : downgradeDefault}</Label>
    </DowngradeContainer>
  ) : (
    <UpgradeContaoner
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isHover ? <UpgradetHoverImage /> : <UpgradeDefaultImage />}
      <UpgradeLabel>{isHover ? upgradeHover : upgradeDefault}</UpgradeLabel>
    </UpgradeContaoner>
  );
};
