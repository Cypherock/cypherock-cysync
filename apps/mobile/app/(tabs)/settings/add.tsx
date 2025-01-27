import {
  Button,
  Container,
  Input,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';

export default function AddPassword() {
  const { strings } = useAppSelector(selectLanguage);
  return (
    <ScreenContainer>
      <Container
        style={{
          gap: 24,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Typography type="h3" textAlign="left">
          {strings.settings.addNewPassword.title}
        </Typography>
        <Container
          style={{
            paddingVertical: 0,
            paddingHorizontal: 0,
            gap: 16,
          }}
        >
          <Container style={{ gap: 8 }}>
            <Input
              placeholder={
                strings.settings.addNewPassword.inputs.newPassword.placeholder
              }
            />
            <Typography
              type="label"
              color="secondary"
              textAlign="left"
              style={{ flexShrink: 0 }}
            >
              {strings.settings.addNewPassword.inputs.newPassword.description}
            </Typography>
            <Input
              placeholder={
                strings.settings.addNewPassword.inputs.confirmPassword
                  .placeholder
              }
            />
            <Typography color="secondary" type="label" textAlign="left">
              {
                strings.settings.addNewPassword.inputs.confirmPassword
                  .description
              }
            </Typography>
          </Container>
          <Container>
            <Typography color="secondary" type="body" textAlign="left">
              {strings.settings.addNewPassword.inputs.radio.label}
            </Typography>
          </Container>
        </Container>
      </Container>
      <Container style={{ justifyContent: 'flex-end' }}>
        <Button
          title="Continue"
          style={{ marginHorizontal: 16, marginVertical: 12 }}
        />
      </Container>
    </ScreenContainer>
  );
}
