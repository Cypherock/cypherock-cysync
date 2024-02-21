import {
  Angelist,
  ArrowBackward,
  Button,
  Facebook,
  Flex,
  Github,
  LangDisplay,
  Linkedin,
  NoSearchResult,
  NotFound,
  Telegram,
  Twitter,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 700px;
`;

const HeaderDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 20px;
  flex-direction: column;
`;

const Empty = styled.div`
  border-bottom: 1px solid #3a3531;
  color: transparent;
`;

const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const SocialDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const NoResult = ({ searchTerm, handleCallSupport }: any) => (
  <Container>
    <HeaderDiv>
      <Button variant="none">
        <Flex gap={8}>
          <ArrowBackward />
          <Typography color="muted" $fontSize={14}>
            <LangDisplay text="Go Back" />
          </Typography>
        </Flex>
      </Button>
      <Empty>2</Empty>
    </HeaderDiv>
    <NoSearchResult
      image={<NotFound />}
      text="No results found for “Why I can’t find this?”"
      subText="Please try searching another keyword or contact support if you need
        further help"
      searchText={searchTerm}
      helpSection
    />
    <SocialContainer>
      <SocialDiv>
        <Telegram />
        <Github />
        <Angelist />
        <Linkedin />
        <Facebook />
        <Twitter />
      </SocialDiv>
      <Button onClick={handleCallSupport} style={{ marginTop: '20px' }}>
        Contact Support
      </Button>
    </SocialContainer>
  </Container>
);
