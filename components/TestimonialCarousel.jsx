"use client";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import TestimonialCarousel from "../data/TestimonialCarousel";

const Testimonial_Carousel = () => {
  return (
    <div className="mt-24">
      <h2 className="text-3xl font-bold text-center text-orange-900 mb-12">
        What Our Writer Says
      </h2>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {TestimonialCarousel.map((testimonial, index) => {
            return (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <blockquote>
                      <p className="text-orange-700 italic">
                        &quot;{testimonial.text}&quot;
                      </p>
                      <footer>
                        <div className="font-semibold text-orange-900">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-orange-900">
                          {testimonial.role}
                        </div>
                      </footer>
                    </blockquote>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Testimonial_Carousel;
