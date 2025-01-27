import {
  Card,
  Container,
  Copy,
  LangDisplay,
  MessageBox,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import { Images } from '@/constants';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import Octicons from '@expo/vector-icons/Octicons';
import { Image } from 'expo-image';

export default function Receive() {
  const { strings } = useAppSelector(selectLanguage);

  return (
    <ScreenContainer>
      <Container style={{ padding: 16, gap: 24 }}>
        <Typography type="para">
          <LangDisplay
            text={strings.receive.receive.info}
            variables={{
              crypto: (
                <Typography type="para" color="primary">
                  Ethereum 1
                </Typography>
              ),
              wallet: (
                <Typography type="para" color="primary">
                  Cypherock
                </Typography>
              ),
            }}
          />
        </Typography>
        <Container
          style={{
            gap: 16,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={Images.onboarding.screen4_1}
            style={{ width: 151, height: 151 }}
          />
          <Card
            borderColor="secondary"
            style={{ flexDirection: 'row', gap: 24 }}
          >
            <Typography type="para" style={{ textAlign: 'left' }}>
              0xe0A4568d7F15e7EeF2194CC8cA507C2fD17C63D6
            </Typography>
            <Copy />
          </Card>
        </Container>
        <MessageBox
          type="danger"
          icon={<Octicons name="info" size={16} color={colors.text.error} />}
          text={strings.receive.receive.messageBox.danger}
        />
      </Container>
    </ScreenContainer>
  );
}
