import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = React.forwardRef((props, ref) => (
  <CollapsiblePrimitive.Root ref={ref} {...props} />
));
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef((props, ref) => (
  <CollapsiblePrimitive.CollapsibleTrigger ref={ref} {...props} />
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef((props, ref) => (
  <CollapsiblePrimitive.CollapsibleContent ref={ref} {...props} />
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
