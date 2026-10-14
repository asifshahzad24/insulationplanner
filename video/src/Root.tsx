import { Composition, staticFile, type CalculateMetadataFunction } from "remotion";
import { COPY, type Market } from "./copy";
import { FPS, makePlan, type PromoProps, type Shape } from "./plan";
import { Promo } from "./Promo";

const SIZES: Record<Shape, { width: number; height: number }> = {
  wide: { width: 1920, height: 1080 },
  tall: { width: 1080, height: 1920 },
};

const loadInputs: CalculateMetadataFunction<PromoProps> = async ({ props }) => {
  const layout = props.shape === "wide" ? "desktop" : "mobile";
  const manifest = await fetch(staticFile(`capture/${props.market}-${layout}/manifest.json`)).then((r) => r.json());
  const voice = await fetch(staticFile(`voice/${props.market}/durations.json`)).then((r) => r.json());
  return { durationInFrames: makePlan(manifest, voice).total, props: { ...props, manifest, voice } };
};

export function Root() {
  return (
    <>
      {(Object.keys(COPY) as Market[]).flatMap((market) =>
        (Object.keys(SIZES) as Shape[]).map((shape) => (
          <Composition
            key={`${market}-${shape}`}
            id={`${market}-${shape}`}
            component={Promo}
            fps={FPS}
            durationInFrames={900}
            {...SIZES[shape]}
            defaultProps={{ market, shape, manifest: null, voice: null }}
            calculateMetadata={loadInputs}
          />
        )),
      )}
    </>
  );
}
