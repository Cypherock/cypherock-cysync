import {
  Button,
  Card,
  Container,
  InteractiveItem,
  ScreenContainer,
  Seperator,
  Typography,
} from '@/components/ui';
import { Language, LanguageList } from '@/constants';
import { keyValueStore } from '@/db';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectLanguage, setLanguage } from '@/store/lang';
import { useState } from 'react';
import { FlatList } from 'react-native';

export default function LanguageSettings() {
  const { lang, strings } = useAppSelector(selectLanguage);
  const [selected, setSelected] = useState<Language>(lang);
  const dispatch = useAppDispatch();

  function handleLanguageSelect() {
    keyValueStore.appLanguage.set(selected);
    dispatch(setLanguage(selected));
  }

  return (
    <ScreenContainer>
      <Container
        style={{
          gap: 24,
          justifyContent: 'flex-start',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Typography type="h3" textAlign="left" color="primary">
          {strings.settings.displayLanguage.title}
        </Typography>
        <Card
          style={{
            paddingVertical: 0,
            paddingHorizontal: 0,
          }}
        >
          <FlatList
            style={{ width: '100%' }}
            data={LanguageList}
            renderItem={({ item }) => (
              <InteractiveItem
                text={item.name}
                altText={item.id}
                style={{ flex: 1, width: '100%' }}
                selected={item.id === selected}
                onPress={() => setSelected(item.id as typeof lang)}
              />
            )}
            ItemSeparatorComponent={() => <Seperator />}
          />
        </Card>
      </Container>
      <Container style={{ justifyContent: 'flex-end' }}>
        <Button
          title={strings.buttons.apply}
          style={{ marginHorizontal: 16, marginVertical: 12 }}
          onPress={handleLanguageSelect}
        />
      </Container>
    </ScreenContainer>
  );
}
