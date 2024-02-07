import React, { useState } from "react";
import { Drawer } from "antd";
import type { DrawerProps } from "antd";

type UseDrawer = (
  children?: React.ReactNode,
  drawerProps?: DrawerProps
) => [
  React.ReactElement,
  React.Dispatch<React.SetStateAction<DrawerProps>>,
  DrawerProps
];

const useDrawer: UseDrawer = (children, drawerProps = {}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [props, setProps] = useState<DrawerProps>({});
  const _props: DrawerProps = {
    maskClosable: true,
    destroyOnClose: true,
    placement: "right",
    ...drawerProps,
    ...props,
    open,
  };
  const onProxyClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    _props.onClose?.(e);
    setOpen(false);
  };
  const context = (
    <Drawer {..._props} open={open} onClose={onProxyClose}>
      {children || _props.children}
    </Drawer>
  );
  const updateProps = (props: React.SetStateAction<DrawerProps>) => {
    if (typeof props == "function") {
      setProps((prevState) => {
        const _props = props(prevState);
        if (_props.visible === undefined && _props.open !== undefined) {
          setOpen(!!_props.open);
        } else {
          setOpen(!!_props.visible);
        }
        return { ..._props };
      });
    } else {
      if (props.visible === undefined && props.open !== undefined) {
        setOpen(!!props.open);
      } else {
        setOpen(!!props.visible);
      }
      setProps({ ...props });
    }
  };
  return [context, updateProps, _props];
};
export default useDrawer;
