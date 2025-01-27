import { Container, Link, ScreenContainer, Typography } from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { View } from 'react-native';

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
            ver 2.013-cover.0
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
