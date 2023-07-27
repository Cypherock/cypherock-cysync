// import {
//     Check,
//     CloudDownload,
//     LangDisplay,
//     UpdateBar,
//     UpdateState,
//   } from '@cypherock/cysync-ui';
import { FC } from 'react';
//   import { useTheme } from 'styled-components';

//   import {  DeviceUpdateState, useDeviceUpdate } from '~/hooks';

//   import { selectLanguage, useAppSelector } from '..';

//   type UpdateBarType = {
//     [key in DeviceUpdateState]?: {
//       icon: ReactNode;
//       text: string;
//       updateState: UpdateState;
//       buttonText?: string;
//       onButtonClick?: () => void;
//     };
//   };

export const AppUpdateBar: FC = () => null;
//     const theme = useTheme();
//     const lang = useAppSelector(selectLanguage);
//     const {
//         deviceUpdateState,
//         downloadProgress,
//         version,
//         errorToShow,
//         isUpdatesChecked,
//         shouldUpdateInstall,
//         onRetry,
//     } = useDeviceUpdate();

//     const updateBarMap: UpdateBarType = {
//       [DeviceUpdateState.Confirmation]: {
//         icon: <CloudDownload />,
//         text: 'confirmation',
//         buttonText: 'install',
//         updateState: 'normal',
//         onButtonClick: installUpdate,
//       },
//       [DeviceUpdateState.Updating]: {
//         icon: <CloudDownload />,
//         text: 'installing',
//         buttonText: 'installUpdate',
//         updateState: 'normal',
//       },
//       [DeviceUpdateState.Successful]: {
//         icon: <Check />,
//         text: 'successful',
//         buttonText: 'installUpdate',
//         updateState: 'success',
//         onButtonClick: installUpdate,
//       },
//       [DeviceUpdateState.Failed]: {
//         icon: <CloudDownload fill={theme?.palette.warn.main} />,
//         text: 'error',
//         buttonText: 'tryAgain',
//         updateState: 'error',
//         onButtonClick: onRetry,
//       },
//     };

//     return updateInfo ? (
//       <UpdateBar
//         progress={downloadProgress}
//         icon={updateBarMap[appUpdateState]?.icon}
//         state={updateBarMap[appUpdateState]?.updateState}
//         onButtonClick={updateBarMap[appUpdateState]?.onButtonClick}
//         text={
//           updateBarMap[appUpdateState]?.text && (
//             <LangDisplay
//               text={
//                 (lang.strings.appUpdateBar as any)[
//                   updateBarMap[appUpdateState]?.text ?? ''
//                 ]
//               }
//               variables={updateInfo}
//             />
//           )
//         }
//         buttonText={
//           updateBarMap[appUpdateState]?.buttonText && (
//             <LangDisplay
//               text={
//                 (lang.strings.appUpdateBar as any)[
//                   updateBarMap[appUpdateState]?.buttonText ?? ''
//                 ]
//               }
//             />
//           )
//         }
//       />
//     ) : null;
// };
