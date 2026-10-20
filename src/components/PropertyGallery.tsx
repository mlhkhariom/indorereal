import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

const PropertyGallery = ({ images, title }: { images: string[]; title: string }) => {
  const list = images?.length ? images : ["/placeholder.svg"];
  const [emblaRef, embla] = useEmblaCarousel({ loop: list.length > 1 });
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const onSelect = useCallback(() => embla && setIndex(embla.selectedScrollSnap()), [embla]);
  useEffect(() => { if (!embla) return; embla.on("select", onSelect); return () => { embla.off("select", onSelect); }; }, [embla, onSelect]);

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-muted">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {list.map((src, i) => (
              <div key={src + i} className="flex-[0_0_100%] min-w-0 aspect-video">
                <img src={src} alt={`${title} photo ${i + 1}`} className="w-full h-full object-cover cursor-zoom-in"
                  loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} decoding="async"
                  width={1280} height={720} onClick={() => setOpen(true)} />
              </div>
            ))}
          </div>
        </div>
        {list.length > 1 && (
          <>
            <button aria-label="Previous photo" onClick={() => embla?.scrollPrev()} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 flex items-center justify-center shadow"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
            <button aria-label="Next photo" onClick={() => embla?.scrollNext()} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 flex items-center justify-center shadow"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
          </>
        )}
        <button onClick={() => setOpen(true)} className="absolute bottom-3 right-3 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-semibold flex items-center gap-1 shadow">
          <Expand className="h-3.5 w-3.5" aria-hidden="true" /> {index + 1} / {list.length}
        </button>
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button key={src + i} aria-label={`Show photo ${i + 1}`} onClick={() => embla?.scrollTo(i)}
              className={`shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition ${i === index ? "border-secondary" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
      <Lightbox open={open} close={() => setOpen(false)} index={index} slides={list.map((src) => ({ src }))} />
    </div>
  );
};

export default PropertyGallery;
