import { MapPreview } from "./_shared/MapPreview";
import { BubbleLayer } from "./_shared/BubbleLayer";

export function Bubbles() {
  return (
    <MapPreview
      title="A clearer picture of coverage"
      subtitle="Compare screen coverage at a glance. Larger circles mean more screens; explore an area to reveal its individual locations."
      renderLayer={(props) => <BubbleLayer {...props} />}
    />
  );
}
