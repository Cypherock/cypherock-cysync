import {
  Button,
  Container,
  Flex,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { View } from 'react-native';

interface NoDataScreenProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function NoDataScreen({
  title,
  description,
  onAction,
  actionText,
}: NoDataScreenProps) {
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
          <Typography type="h2">{title}</Typography>
          {description && <Typography type="para">{description}</Typography>}
        </View>
      </Container>
      {onAction && actionText && (
        <Flex style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <Button
            style={{ width: '100%' }}
            title={actionText}
            onPress={onAction}
          />
        </Flex>
      )}
    </ScreenContainer>
  );
}
