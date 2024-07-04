import React from "react";
import { Link } from "react-router-dom";
import { Check, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricing = [
  {
    name: "Personal",
    price: "Free",
    popular: false,
    features: ["Lifetime free", "max 10 links", "5 free template"],
    button: {
      text: "Get Started",
      link: "/register",
    },
  },
  {
    name: "Startup",
    price: "$0.99",
    popular: true,
    features: ["max 25 links", "30 free template", "Admin Support"],
    button: {
      text: "Get Started",
      link: "/register",
    },
  },
  {
    name: "Enterprise",
    price: "$19.99",
    popular: false,
    features: ["Unlimited link", "Unlimited free template", "Admin support"],
    button: {
      text: "Contact us",
      link: "/register",
    },
  },
];

const LandingPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-5">
      <main className="flex flex-row w-full justify-center items-center pt-16 pb-8 md:pt-12 md:pb-24 mt-16">
        <div className="py-6 md:order-1 md:block">
          <div className="max-w-3xl text-center">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight xl:tracking-tighter">
              Multiple Links for your link in bio
            </h1>
            <p className="text-lg mt-4 text-slate-600 max-w-3xl">
              One link to help you share everything you create, curate and sell
              from your Instagram, TikTok, Twitter, YouTube and other social
              media profiles.
            </p>
            <div className="mt-6 flex flex-col justify-center sm:flex-row gap-3">
              <Button>
                <LogIn className="mr-2 h-4 w-4" />
                <Link to="register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <div className="flex flex-col w-full justify-center items-center pb-8 md:pb-24 ">
        <div className="max-w-3xl text-center gap-5">
          <h1 className="text-4xl font-bold lg:tracking-tight xl:tracking-tighter">
            Pricing
          </h1>
          <p>Simple & Predictable pricing. No Surprises.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mx-auto max-w-screen-lg mt-12">
          {pricing.map((item) => (
            <div className="flex flex-col w-full order-first lg:order-none border-2 border-[#D8DEE9] border-opacity-50 py-5 px-6 rounded-md">
              <div className="text-center">
                <h4 className="text-lg font-medium text-gray-400">
                  {item.name}
                </h4>
                <p className="mt-3 text-4xl font-bold md:text-4xl">
                  {item.price}
                </p>
              </div>
              <ul className="grid mt-8 text-left gap-y-4">
                {item.features.map((item) => (
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex mt-8">
                <Button className="w-full">
                  <Link to={item.button.link || "#"}>
                    {item.button.text || "Get Started"}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
