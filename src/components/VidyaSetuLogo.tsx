import React from 'react';
import { YuvaSetuLogo, YuvaSetuLogoProps } from './YuvaSetuLogo';

export type VidyaSetuLogoProps = YuvaSetuLogoProps;

export const VidyaSetuLogo: React.FC<VidyaSetuLogoProps> = (props) => {
  return <YuvaSetuLogo {...props} />;
};

export { YuvaSetuLogo };
export default YuvaSetuLogo;
