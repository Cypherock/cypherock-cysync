import React, { FC, useEffect, useState } from 'react';

import { ContactSupport } from '~/pages/MainApp/Components';
import { selectLanguage, useAppSelector } from '~/store';

const dataArray = [
  {
    id: '0',
    text: 'feedback',
  },
  {
    id: '1',
    text: 'feedback 1',
  },
  {
    id: '2',
    text: 'feedback 2',
  },
  {
    id: '3',
    text: 'feedback 3',
  },
];

export const Portfolio: FC = () => {
  // const { strings } = useAppSelector(selectLanguage);
  const lang = useAppSelector(selectLanguage);
  const { buttons } = lang.strings;
  const contact = lang.strings.contactForm;
  // const dispatch = useDispatch();
  const [isApplicationChecked, setIsApplicationChecked] = useState(false);
  const [isDeviceChecked, setIsDeviceChecked] = useState(false);

  const handleApplicationCheckedItem = () => {
    setIsApplicationChecked(!isApplicationChecked);
  };

  const handleDeviceCheckedItem = () => {
    setIsDeviceChecked(!isDeviceChecked);
  };

  useEffect(() => {
    // dispatch(openWalletActionsDialog());
  }, []);

  return (
    // <MainAppLayout title={strings.portfolio.title}>
    //   <AssetAllocation />
    // </MainAppLayout>
    <ContactSupport
      header={contact.header}
      title={contact.title}
      subTitle={contact.subTitle}
      btnCancel={buttons.cancel}
      btnSubmit={buttons.submit}
      email={contact.email}
      category={contact.category}
      description={contact.description}
      label1={contact.label1}
      label2={contact.label2}
      handleApplicationCheckedItem={handleApplicationCheckedItem}
      handleDeviceCheckedItem={handleDeviceCheckedItem}
      isApplicationChecked
      isDeviceChecked={isDeviceChecked}
      errorMsg={contact.error.msg}
      connectionErrorMsg={contact.error.connectionError}
      deviceErrorMsg={contact.error.deviceError}
      confirmMsg={contact.confirmMsg}
      logMsg={contact.logMsg}
      globalError=""
      data={dataArray}
    />
  );
};
