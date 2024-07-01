import { LanguageList } from '@cypherock/cysync-core-constants';
import { Container, Typography, Breadcrumb } from '@cypherock/cysync-ui';
import React from 'react';

import { setAppLanguage } from '~/actions';

import { useAppSelector, selectLanguage, useAppDispatch } from '..';

export interface ILangDropdownProps {
  $fontSize?: number;
}

export const LanguageDropdown: React.FC<ILangDropdownProps> = ({
  $fontSize = 14,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const breadcrumbItems = [
    {
      id: 'lang',
      dropdown: {
        displayNode: (
          <Container direction="row">
            <Typography ml={1} color="muted" $fontSize={$fontSize}>
              {LanguageList.find(l => l.id === lang.lang)?.name}
            </Typography>
          </Container>
        ),
        selectedItem: lang.lang,
        setSelectedItem: (id: string | undefined) =>
          dispatch(setAppLanguage(id)),
        dropdown: LanguageList.map(l => ({
          text: l.name,
          id: l.id,
          displayNode: (
            <Container direction="row">
              <Typography ml={1} color="muted" $fontSize={$fontSize}>
                {l.name}
              </Typography>
            </Container>
          ),
        })),
      },
    },
  ];

  return <Breadcrumb items={breadcrumbItems} />;
};

LanguageDropdown.defaultProps = {
  $fontSize: 14,
};
