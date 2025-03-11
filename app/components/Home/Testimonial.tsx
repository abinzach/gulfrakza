'use client'
import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";

const StackedCardTestimonials = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="bg-white py-24 px-4 lg:px-8 grid items-center grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 overflow-hidden">
      <div className="p-4">
        <h3 className="text-5xl font-inter font-semibold">What our customers think</h3>
        <p className="text-slate-500 my-4 font-inter">
                    At Gulf Rakza, our commitment to excellence is reflected in every interaction. We pride ourselves on delivering exceptional service and high-quality products, ensuring our customers receive nothing but the best.
        </p>
        <SelectBtns
          numTracks={testimonials.length}
          setSelected={setSelected}
          selected={selected}
        />
      </div>
      <Cards
        testimonials={testimonials}
        setSelected={setSelected}
        selected={selected}
      />
    </section>
  );
};

const SelectBtns = ({
  numTracks,
  setSelected,
  selected,
}: {
  numTracks: number;
  setSelected: Dispatch<SetStateAction<number>>;
  selected: number;
}) => {
  return (
    <div className="flex gap-1 mt-8">
      {Array.from(Array(numTracks).keys()).map((n) => {
        return (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className="h-1.5 w-full bg-slate-300 relative"
          >
            {selected === n ? (
              <motion.span
                className="absolute top-0 left-0 bottom-0 bg-slate-950"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5 }}
                onAnimationComplete={() => {
                  setSelected(selected === numTracks - 1 ? 0 : selected + 1);
                }}
              />
            ) : (
              <span
                className="absolute top-0 left-0 bottom-0 bg-slate-950"
                style={{ width: selected > n ? "100%" : "0%" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

const Cards = ({
  testimonials,
  selected,
  setSelected,
}: {
  testimonials: Testimonial[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="p-4 relative h-[450px] lg:h-[500px] shadow-xl">
      {testimonials.map((t, i) => {
        return (
          <Card
            {...t}
            key={i}
            position={i}
            selected={selected}
            setSelected={setSelected}
          />
        );
      })}
    </div>
  );
};

const Card = ({
  rating,
  headline,
  description,
  name,
  title,
  position,
  selected,
  setSelected,
}: Testimonial & {
  position: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) => {
  const scale = position <= selected ? 1 : 1 + 0.015 * (position - selected);
  const offset = position <= selected ? 0 : 95 + (position - selected) * 3;
  const background = position % 2 ? "black" : "white";
  const color = position % 2 ? "white" : "black";

  return (
    <motion.div
      initial={false}
      style={{
        zIndex: position,
        transformOrigin: "left bottom",
        background,
        color,
      }}
      animate={{ x: `${offset}%`, scale }}
      whileHover={{ translateX: position === selected ? 0 : -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => setSelected(position)}
      className="absolute top-0 left-0 w-full min-h-full p-8 lg:p-12 cursor-pointer flex flex-col justify-between"
    >
      {/* Company logo */}
      
      {/* Rating & Headline */}
      <div className="text-left mt-4">
        <p className="text-xl font-bold ">{rating}</p>
        <p className="text-xl font-semibold">{headline}</p>
      </div>
      
      {/* Testimonial quote */}
      <p className="text-lg lg:text-xl font-light italic my-8">
        &quot;{description}&quot;
      </p>
      
      {/* Author info */}
      <div>
        <span className="block font-semibold text-lg">{name}</span>
        <span className="block text-sm">{title}</span>
      </div>
    </motion.div>
  );
};

export default StackedCardTestimonials;

interface Testimonial {
  rating: string;
  headline: string;
  description: string;
  name: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    rating: "⭐⭐⭐⭐⭐",
    headline: "Impressive Service & Fast Delivery",
    description:
      "We've been working with Gulf Rakza for our safety and industrial equipment needs, and their service has been outstanding. Orders are always delivered on time, and the quality is top-notch. A reliable partner we highly recommend!",
    name: "Mohammed A.",
    title: "Construction Contractor",
  },
  {
    rating: "⭐⭐⭐⭐⭐",
    headline: "Dependable & Professional",
    description:
      "Gulf Rakza has quickly become one of our trusted suppliers. Their team is professional, responsive, and ensures we get the right products at competitive prices. Great service!",
    name: "Sara K.",
    title: "Procurement Manager",
  },
  {
    rating: "⭐⭐⭐⭐⭐",
    headline: "Customer-Focused & Efficient",
    description:
      "The team at Gulf Rakza is always ready to assist with our orders, offering quick responses and efficient service. Their product range is exactly what we need, and their reliability makes them a great business partner.",
    name: "Ahmed R.",
    title: "Industrial Equipment Distributor",
  },
  {
    rating: "⭐⭐⭐⭐⭐",
    headline: "High-Quality Products & Great Pricing",
    description:
      "We've been sourcing safety and electrical supplies from Gulf Rakza, and we’re very satisfied. Their products are of excellent quality, pricing is fair, and their service is professional. Highly recommended!",
    name: "Faisal M.",
    title: "Manufacturing Plant Manager",
  },
  {
    rating: "⭐⭐⭐⭐⭐",
    headline: "Trustworthy Supplier & Excellent Support",
    description:
      "Working with Gulf Rakza has been a great experience. Their quick response, attention to detail, and commitment to quality make them a supplier we can rely on. Looking forward to a long-term partnership!",
    name: "Omar H.",
    title: "Project Engineer",
  },
];
