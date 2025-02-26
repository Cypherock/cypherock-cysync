import { Container, Link, ScreenContainer, Typography } from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { View } from 'react-native';
import Constants from 'expo-constants';

export default function About() {
  const { strings } = useAppSelector(selectLanguage);
  return (
    <ScreenContainer>
      <Container
        style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 24 }}
      >
        <View>
          <Typography type="h4" textAlign="left">
            {strings.settings.about.title}
          </Typography>
          <Typography type="para" textAlign="left">
            {Constants.expoConfig?.version}
          </Typography>
        </View>
        <View>
          <Typography type="h4" textAlign="left">
            {strings.settings.about.termsOfUse}
          </Typography>
          <Link href={'https://cypherock.com/terms'}>
            https://cypherock.com/terms
          </Link>
        </View>
        <View>
          <Typography type="h4" textAlign="left">
            {strings.settings.about.privacyPolicy}
          </Typography>
          <Link href={'https://cypherock.com/privacy'}>
            https://cypherock.com/privacy
          </Link>
        </View>
      </Container>
    </ScreenContainer>
  );
}
