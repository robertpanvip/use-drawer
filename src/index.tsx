import React, { useState } from "react";
import { Drawer } from "antd";
import type { DrawerProps } from "antd";

import { pxToRem } from "@/utils/rem";

export type DefaultRender<E> =
  | React.ReactNode
  | ((extra: E | undefined, props: DrawerProps) => React.ReactNode);

declare type EventType =
  | React.KeyboardEvent<Element>
  | React.MouseEvent<Element | HTMLButtonElement>;

function useDrawer<E>(
  defaultRender?: DefaultRender<E>,
  drawerProps: DrawerProps = {}
): [
  React.ReactElement,
  React.Dispatch<React.SetStateAction<DrawerProps>>,
  boolean
] {
  const [open, setOpen] = useState<boolean>(false);
  const [props, setProps] = useState<DrawerProps & { state?: E }>({});
  const mergedProps = { ...drawerProps, ...props };
  const onProxyClose = (e: EventType) => {
    mergedProps.onClose?.(e);
    setOpen(false);
  };
  const { state, ...rest } = mergedProps;
  const context = (
    <Drawer
      destroyOnClose
      placement="right"
      {...rest}
      width={pxToRem(
        mergedProps.width || (mergedProps.size === "large" ? 736 : 378)
      )}
      open={open}
      onClose={onProxyClose}
    >
      {mergedProps.children ||
        (defaultRender &&
          (typeof defaultRender === "function"
            ? defaultRender(state, mergedProps)
            : defaultRender))}
    </Drawer>
  );

  const updateProps = (props: React.SetStateAction<DrawerProps>) => {
    if (typeof props == "function") {
      setProps((prevState) => {
        const _props = props(prevState);
        setOpen(!!_props.open);
        return { ..._props };
      });
    } else {
      setOpen(!!props.open);
      setProps({ ...props });
    }
  };
  return [context, updateProps, open];
}

export default useDrawer;
