import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Button,
  Container,
  LangDisplay,
  Link,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { Images } from '@/constants/images';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import Constants from 'expo-constants';

export default function Index() {
  const { strings } = useAppSelector(selectLanguage);
  return (
    <ScreenContainer>
      <Container>
        <Image source={Images.onboarding.welcome} style={styles.image} />
      </Container>
      <View
        style={{
          gap: 24,
          padding: 24,
        }}
      >
        <View
          style={{
            gap: 8,
          }}
        >
          <Typography type="h1">{strings.onboarding.welcome.title}</Typography>
          <Typography type="para">
            {strings.onboarding.welcome.description}
          </Typography>
        </View>
        <View
          style={{
            gap: 8,
          }}
        >
          <Button
            title="Get Started"
            onPress={() => router.push('/onboarding')}
          />
          <Typography type="para">
            <LangDisplay
              text={strings.onboarding.welcome.byProceeding}
              variables={{
                termsOfUse: (
                  <Link href={'https://www.cypherock.com/terms'}>
                    {strings.onboarding.welcome.termsOfUse}
                  </Link>
                ),
                privacyPolicy: (
                  <Link href={'https://www.cypherock.com/privacy'}>
                    {strings.onboarding.welcome.privacyPolicy}
                  </Link>
                ),
              }}
            />
          </Typography>
          <Typography type="para">{Constants.expoConfig?.version}</Typography>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    left: -20,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});
