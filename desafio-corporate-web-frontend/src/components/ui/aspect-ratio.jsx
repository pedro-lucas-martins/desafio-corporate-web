import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = React.forwardRef((props, ref) => (
  <AspectRatioPrimitive.Root ref={ref} {...props} />
));
AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;

export { AspectRatio };
