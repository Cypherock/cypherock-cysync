import {
  Card,
  Container,
  Link,
  LinkedinIcon,
  ScreenContainer,
  Seperator,
  TelegramIcon,
  Typography,
  WellfoundIcon,
  XIcon,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import AntDesign from '@expo/vector-icons/AntDesign';
import { View } from 'react-native';

export default function Support() {
  const { strings } = useAppSelector(selectLanguage);

  return (
    <ScreenContainer>
      <Container
        style={{
          gap: 24,
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ justifyContent: 'flex-end', gap: 4 }}>
          <Typography type="h3">{strings.support.support.title}</Typography>
          <Typography type="para">
            {strings.support.support.description}{' '}
            <Link href={'mailto:support@cypherock.com'}>
              support@cypherock.com
            </Link>
          </Typography>
        </View>
        <Seperator />
        <View style={{ gap: 4 }}>
          <Typography type="h3">{strings.support.socials.title}</Typography>
          <Typography type="para">
            {strings.support.socials.description}
          </Typography>
          <Link
            href={'https://cypherock.com/blogs'}
            style={{ textAlign: 'center' }}
          >
            https://cypherock.com/blogs
          </Link>
        </View>
        <View style={{ gap: 16, flexDirection: 'row' }}>
          <Link href={'https://t.me/cypherock'}>
            <Card
              style={{
                width: 24,
                height: 24,
                paddingHorizontal: 0,
                paddingVertical: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TelegramIcon style={{ width: 12 }} />
            </Card>
          </Link>
          <Link href={'https://github.com/Cypherock'}>
            <Card
              style={{
                width: 24,
                height: 24,
                paddingHorizontal: 0,
                paddingVertical: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AntDesign name="github" size={12} color={'white'} />
            </Card>
          </Link>
          <Link href={'https://wellfound.com/company/cypherock-wallet'}>
            <Card
              style={{
                width: 24,
                height: 24,
                paddingHorizontal: 0,
                paddingVertical: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <WellfoundIcon style={{ width: 12 }} />
            </Card>
          </Link>
          <Link href={'https://sg.linkedin.com/company/cypherockwallet'}>
            <Card
              style={{
                width: 24,
                height: 24,
                paddingHorizontal: 0,
                paddingVertical: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LinkedinIcon style={{ width: 12 }} />
            </Card>
          </Link>
          <Link href={'https://x.com/CypherockWallet'}>
            <Card
              style={{
                width: 24,
                height: 24,
                paddingHorizontal: 0,
                paddingVertical: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <XIcon style={{ width: 12 }} />
            </Card>
          </Link>
        </View>
      </Container>
    </ScreenContainer>
  );
}
