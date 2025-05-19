import {
  ArrowDown,
  ArrowUp,
  Button,
  CloseButton,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Divider,
  EditAccountIcon,
  Flex,
  Input,
  SimpleJsonView,
  LangDisplay,
  MessageBox,
  ScrollContainer,
  ScrollableContainer,
  Typography,
  parseLangTemplate,
} from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useEditAccountDialog } from '../context';

export const AccountDetails: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const {
    onNext,
    onClose,
    onApply,
    selectedAccount,
    selectedWallet,
    accountName,
    handleAccountNameChange,
    // unitDropdownList,
    // selectedUnit,
    // setSelectedUnit,
  } = useEditAccountDialog();

  const { accountEdit, header: headerText } = lang.strings.dialogs.editAccount;
  const [showAdvance, setShowAdvance] = useState(false);

  // const handleUnitChangeProxy: typeof setSelectedUnit = useCallback(
  //   (...args) => {
  //     logger.info('Dropdown Change: Unit Change', {
  //       source: `EditAccount/${AccountDetails.name}`,
  //       unit: args[0],
  //     });
  //     return setSelectedUnit(...args);
  //   },
  //   [setSelectedUnit],
  // );

  const accountData = useMemo(
    () => ({
      derivationPath: selectedAccount?.derivationPath,
      ...(selectedAccount?.derivationScheme
        ? { derivationScheme: selectedAccount.derivationScheme }
        : {}),
      xpubOrAddress: selectedAccount?.xpubOrAddress,
    }),
    [selectedAccount],
  );

  return (
    <DialogBox width={700} onClose={onClose} $maxHeight="90vh">
      <DialogBoxHeader direction="row" py={2} px={3}>
        <Typography
          pl={3}
          grow={1}
          $alignSelf="stretch"
          color="muted"
          $textAlign="center"
        >
          <LangDisplay text={headerText} />
        </Typography>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
      <ScrollableContainer>
        <DialogBoxBody p={0} gap={0}>
          <Container
            display="flex"
            direction="column"
            gap={{ def: 16, lg: 32 }}
            width="full"
            pt={4}
            pb={{ def: 2, lg: 4 }}
            px={{ def: 3, lg: 5 }}
          >
            <EditAccountIcon height={102} width={100} />
            <Container display="flex" direction="column" gap={4} width="full">
              <Typography variant="h5" $textAlign="center" $fontSize={20}>
                <LangDisplay text={accountEdit.title} />
              </Typography>
              <Typography
                $textAlign="center"
                $fontSize={16}
                $fontWeight="normal"
                color="muted"
              >
                <LangDisplay text={accountEdit.subtitle} />
              </Typography>
            </Container>
          </Container>
          <Container
            display="flex"
            direction="column"
            width="full"
            pt={2}
            pb={{ def: 2, lg: 4 }}
            px={{ def: 3, lg: 5 }}
            gap={0}
            align="stretch"
          >
            <Flex
              gap={4}
              pt={4}
              pb="12px"
              justify="space-between"
              align="center"
            >
              <Typography $fontSize={20}>
                <LangDisplay text={accountEdit.input.accountName.title} />
              </Typography>
              <Flex width={292}>
                <Input
                  autoFocus
                  type="text"
                  name="accountName"
                  value={accountName}
                  onChange={handleAccountNameChange}
                  placeholder={accountEdit.input.accountName.title}
                />
              </Flex>
            </Flex>
            <Divider variant="horizontal" />
            {/* <Flex
              gap={4}
              pt="12px"
              pb="12px"
              justify="space-between"
              align="center"
            >
              <Typography $fontSize={20}>
                <LangDisplay text={accountEdit.input.unit.title} />
              </Typography>
              <Flex width={292}>
                <Dropdown
                  items={unitDropdownList}
                  selectedItem={selectedUnit}
                  searchText={accountEdit.input.unit.title}
                  placeholderText={accountEdit.input.unit.title}
                  onChange={handleUnitChangeProxy}
                  noLeftImageInList
                />
              </Flex>
            </Flex>
            <Divider variant="horizontal" /> */}
            <Container
              display="flex"
              direction="column"
              gap={32}
              mt={6}
              align="stretch"
            >
              <Flex
                justify="space-between"
                pb="12px"
                onClick={() => setShowAdvance(state => !state)}
                $cursor="pointer"
              >
                <Typography $fontSize={18} color="white">
                  <LangDisplay text={accountEdit.advanced} />
                </Typography>
                {showAdvance ? <ArrowUp /> : <ArrowDown />}
              </Flex>
              {showAdvance && (
                <>
                  {selectedAccount?.familyId === 'bitcoin' && (
                    <MessageBox
                      type="info"
                      text={parseLangTemplate(accountEdit.info, {
                        derivationSchemeName: selectedAccount.derivationScheme,
                      })}
                    />
                  )}
                  <ScrollContainer
                    $bgColor="container"
                    p={2}
                    $maxHeight="210px"
                  >
                    <Typography variant="span" color="muted" $fontSize={13}>
                      <SimpleJsonView src={accountData} />
                    </Typography>
                  </ScrollContainer>
                </>
              )}
            </Container>
          </Container>
        </DialogBoxBody>
      </ScrollableContainer>
      <DialogBoxFooter py={4} px={5}>
        <Button
          variant="danger"
          onClick={e => {
            e.preventDefault();
            onNext();
          }}
        >
          <LangDisplay text={accountEdit.buttons.remove} />
        </Button>
        <Button
          variant="primary"
          disabled={!selectedAccount || !selectedWallet}
          onClick={e => {
            e.preventDefault();
            onApply();
          }}
        >
          <LangDisplay text={accountEdit.buttons.apply} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
