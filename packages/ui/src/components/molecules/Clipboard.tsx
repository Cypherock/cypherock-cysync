import React, { FC, useEffect, useRef, useState } from 'react';

import { goldCopyIcon, copyIcon, checkIcon } from '../../assets';
import { Button, Image } from '../atoms';

export type ClipboardVariants = 'gold' | 'white';

export type ClipboardSize = 'sm' | 'md';

interface ClipboardProps {
  variant?: ClipboardVariants;
  size?: ClipboardSize;
  content: string;
  copiedStateTimeout?: number;
  onCopy?: () => void;
}

const iconMap: Record<ClipboardVariants, string> = {
  gold: goldCopyIcon,
  white: copyIcon,
};

const sizeMap: Record<ClipboardSize, { width: string; height: string }> = {
  sm: { width: '15px', height: '12px' },
  md: { width: '25px', height: '20px' },
};

export const Clipboard: FC<ClipboardProps> = ({
  variant,
  content,
  size,
  onCopy,
  copiedStateTimeout,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number>();

  const toggleCopied = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    if (onCopy) {
      onCopy();
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsCopied(false);
    }, copiedStateTimeout ?? 3000);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const getIcon = () => {
    if (isCopied) return checkIcon;
    return iconMap[variant ?? 'white'];
  };

  const getSize = () => sizeMap[size ?? 'sm'];

  return (
    <Button variant="none" onClick={toggleCopied} disabled={isCopied}>
      <Image
        src={getIcon()}
        alt="Copy"
        $height={getSize().height}
        $width={getSize().width}
      />
    </Button>
  );
};

Clipboard.defaultProps = {
  variant: 'white',
  size: 'sm',
  copiedStateTimeout: undefined,
  onCopy: undefined,
};
