import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, CloudDownload, GitBranchPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Bring Your Own Framework",
    description:
      "Build your site using React, Svelte, Vue, Preact, web components, or just plain ol' HTML + JavaScript.",
    icon: "bx:bxs-briefcase",
  },
  {
    title: "100% Static HTML, No JS",
    description:
      "Astro renders your entire page to static HTML, removing all JavaScript from your final build by default.",
    icon: "bx:bxs-window-alt",
  },
  {
    title: "On-Demand Components",
    description:
      "Need some JS? Astro can automatically hydrate interactive components when they become visible on the page.  ",
    icon: "bx:bxs-data",
  },
  {
    title: "Broad Integration",
    description:
      "Astro supports TypeScript, Scoped CSS, CSS Modules, Sass, Tailwind, Markdown, MDX, and any other npm packages.",
    icon: "bx:bxs-bot",
  },
  {
    title: "SEO Enabled",
    description:
      "Automatic sitemaps, RSS feeds, pagination and collections take the pain out of SEO and syndication. It just works!",
    icon: "bx:bxs-file-find",
  },
  {
    title: "Community",
    description:
      "Astro is an open source project powered by hundreds of contributors making thousands of individual contributions.",
    icon: "bx:bxs-user",
  },
];

const pricing = [
  {
    name: "Personal",
    price: "Free",
    popular: false,
    features: [
      "Lifetime free",
      "Up to 3 users",
      "Unlimited Pages",
      "Astro Sub domain",
      "Basic Integrations",
      "Community Support",
    ],
    button: {
      text: "Get Started",
      link: "/",
    },
  },
  {
    name: "Startup",
    price: "$19",
    popular: true,
    features: [
      "All Free Features",
      "Up to 20 users",
      "20 Custom domains",
      "Unlimited Collaborators",
      "Advanced Integrations",
      "Priority Support",
    ],
    button: {
      text: "Get Started",
      link: "#",
    },
  },
  {
    name: "Enterprise",
    price: "Custom",
    popular: false,
    features: [
      "All Pro Features",
      "Unlimited Custom domains",
      "99.99% Uptime SLA",
      "SAML & SSO Integration",
      "Dedicated Account Manager",
      "24/7 Phone Support",
    ],
    button: {
      text: "Contact us",
      link: "/contact",
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
              Marketing website done with Astro
            </h1>
            <p className="text-lg mt-4 text-slate-600 max-w-3xl">
              Astroship is a starter template for startups, marketing websites &
              landing pages.
              <wbr /> Built with Astro.build and TailwindCSS. You can quickly
              create any website with this starter.
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
      <footer className="my-20">
        <p className="text-center text-sm text-slate-500">
          Copyright © {new Date().getFullYear()} mylink.bio All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
