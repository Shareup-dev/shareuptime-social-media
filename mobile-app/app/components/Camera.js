import React from 'react';

export default function AppCamera({
  children: _children,
  style: _style,
  type: _type,
  statusPadding: _statusPadding = true,
  forwardRef: _forwardRef,
}) {
  // return (
  //   <Camera
  //     ratio={'16:9'}
  //     ref={forwardRef}
  //     type={type}
  //     behavior={Platform.OS === 'ios' ? 'height' : 'height'}
  //     style={[
  //       styles.camera,
  //       {paddingTop: statusPadding ? StatusBar.currentHeight : 0},
  //       style,
  //     ]}>
  //     <CameraHeader title="Story " />
  //     {children}
  //   </Camera>
  // );
  return <></>;
}

// no styles needed
