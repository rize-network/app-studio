import { View, Image } from 'app-studio';
import { Button } from '@app-studio/web';
import { useCallback, useState, forwardRef } from 'react';

function HeroSection() {
  return (
    <JoinNowButtonContainer>
      {/* Button Component is detected here. We've generated code using HTML. See other options in "Component library" dropdown in Settings */}
      <JoinButton>Join now</JoinButton>
      <JoinButtonContainer>
        <ImageContainerImgContentCd5c4a0d />
      </JoinButtonContainer>
    </JoinNowButtonContainer>
  );
}

export default HeroSection;

const JoinNowButtonContainer = (props) => (
  <View
    boxSizing={'border-box'}
    display={'flex'}
    flex={1}
    flexDirection={'column'}
    alignItems={'stretch'}
    alignSelf={'center'}
    justifyContent={'center'}
    padding={40}
    {...props}
  />
);

const JoinButton = (props) => (
  <Button
    boxSizing={'border-box'}
    display={'block'}
    flex={0}
    width={161}
    height={48}
    font={500}
    color={85}
    cursor={'pointer'}
    background={255}
    border={'none'}
    borderRadius={8}
    {...props}
  />
);

const JoinButtonContainer = (props) => (
  <View flex={0} paddingRight={24} paddingLeft={42} marginTop={58} {...props} />
);

const ImageContainerImgContentCd5c4a0d = (props) => (
  <Image
    boxSizing={'border-box'}
    display={'block'}
    width={120}
    maxWidth={'initial'}
    height={120}
    content={8}
    {...props}
  />
);
