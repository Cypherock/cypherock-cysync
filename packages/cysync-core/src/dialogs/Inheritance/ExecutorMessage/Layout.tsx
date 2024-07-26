import {
  DialogBox,
  DialogBoxHeader,
  LangDisplay,
  CloseButton,
  ScrollableContainer,
  DialogBoxBody,
  DialogBoxFooter,
  Button,
  ButtonProps,
} from '@cypherock/cysync-ui';
import React from 'react';

export interface IInheritanceExecutorMessageProps {
  children: React.ReactNode;
  onClose: () => void;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
  isActionButtonDisabled?: boolean;
  isActionButtonLoading?: boolean;
  actionButtonVariant?: ButtonProps['variant'];
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
  isSecondaryButtonDisabled?: boolean;
  isSecondaryButtonLoading?: boolean;
  secondaryButtonVariant?: ButtonProps['variant'];
  formId?: string;
}

export const InheritanceExecutorMessageLayout: React.FC<
  IInheritanceExecutorMessageProps
> = ({
  children,
  onClose,
  actionButtonText,
  onActionButtonClick,
  isActionButtonDisabled,
  isActionButtonLoading,
  actionButtonVariant,
  secondaryButtonText,
  onSecondaryButtonClick,
  isSecondaryButtonDisabled,
  isSecondaryButtonLoading,
  secondaryButtonVariant,
  formId,
}) => (
  <DialogBox width={800} onClose={onClose} $maxHeight="90vh">
    <DialogBoxHeader direction="row" justify="flex-end" py={2} px={3}>
      <CloseButton width={24} onClick={onClose} />
    </DialogBoxHeader>
    <ScrollableContainer>
      <DialogBoxBody px={5} py={4} gap={0}>
        {children}
      </DialogBoxBody>
    </ScrollableContainer>
    {actionButtonText && onActionButtonClick && (
      <DialogBoxFooter py={4} px={5}>
        {secondaryButtonText && onSecondaryButtonClick && (
          <Button
            variant={secondaryButtonVariant ?? 'secondary'}
            disabled={isSecondaryButtonDisabled}
            isLoading={isSecondaryButtonLoading}
            onClick={e => {
              e.preventDefault();
              onSecondaryButtonClick();
            }}
            form={formId}
            type={formId ? 'reset' : 'button'}
          >
            <LangDisplay text={secondaryButtonText} />
          </Button>
        )}
        <Button
          variant={actionButtonVariant ?? 'primary'}
          disabled={isActionButtonDisabled}
          isLoading={isActionButtonLoading}
          onClick={e => {
            e.preventDefault();
            onActionButtonClick();
          }}
          form={formId}
          type={formId ? 'submit' : 'button'}
        >
          <LangDisplay text={actionButtonText} />
        </Button>
      </DialogBoxFooter>
    )}
  </DialogBox>
);

InheritanceExecutorMessageLayout.defaultProps = {
  actionButtonText: undefined,
  onActionButtonClick: undefined,
  isActionButtonDisabled: undefined,
  actionButtonVariant: undefined,
  isActionButtonLoading: undefined,
  secondaryButtonText: undefined,
  onSecondaryButtonClick: undefined,
  isSecondaryButtonDisabled: undefined,
  isSecondaryButtonLoading: undefined,
  secondaryButtonVariant: undefined,
  formId: undefined,
};
