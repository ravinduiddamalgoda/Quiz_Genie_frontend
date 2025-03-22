// app/page.tsx
"use client";

import React from "react";

import { BackgroundGradient } from "@/component/background-gradient";
import { CardBody, CardContainer, CardItem } from "@/component/3d-card";
import { TextGenerateEffect } from "@/component/text-generate-effect";
import { Meteors } from "@/component/meteors";

interface NavItem {
  name: string;
  link: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

export default function HomePage() {

  const features: Feature[] = [
    {
      title: "AI-Driven Quiz Generation",
      description: "Uses LangChain & RAG to generate quizzes from educational PDFs with multiple difficulty levels.",
      icon: "📚",
    },
    {
      title: "Level-Based Learning Path",
      description: "Automatically categorizes questions into difficulty levels and guides users to higher levels as they progress.",
      icon: "🚀",
    },
    {
      title: "Personalized Learning Experience",
      description: "Suggests new questions based on users' past mistakes and tailors quizzes to focus on knowledge gaps for improvement.",
      icon: "🎯",
    },
    {
      title: "Multilingual Support",
      description: "Supports both Sinhala and English content for wider accessibility and language-inclusive learning.",
      icon: "🌐",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      

      {/* Hero Section with Mixed Color Gradient Background */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <Meteors/>
        <div className="absolute inset-0 bg-grid-gray-500/[0.05] bg-grid-gray-500/[0.05]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[40rem] w-[40rem] rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="z-10 text-center px-6 md:px-10 lg:px-20 max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow-sm">
            <TextGenerateEffect words="RAG-Based Intelligent Adaptive Quiz System" />
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto">
            The next generation of AI-powered learning that adapts to your needs
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-full border-2 border-purple-600 text-purple-600 font-medium hover:bg-purple-50 shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section with Color Variety */}
      <div id="features" className="py-20 px-6 md:px-10 lg:px-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-purple-600 font-medium mb-2">POWERFUL CAPABILITIES</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 max-w-xl mx-auto">
              Key Features
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => {
              // Different colors for each feature card
              const colors = [
                { bg: "bg-amber-100", text: "text-amber-800" },
                { bg: "bg-emerald-100", text: "text-emerald-800" },
                { bg: "bg-rose-100", text: "text-rose-800" },
                { bg: "bg-violet-100", text: "text-violet-800" }
              ];
              const color = colors[index % colors.length];
              
              return (
                <BackgroundGradient key={index} className="rounded-[22px] bg-white p-4 sm:p-10 border border-gray-100">
                  <CardContainer className="w-full">
                    <CardBody className="bg-transparent flex flex-col items-start gap-4">
                      <div className={`text-5xl ${color.bg} p-4 rounded-2xl`}>{feature.icon}</div>
                      <CardItem as="h3" translateZ={20} className="text-2xl font-bold text-gray-900">
                        {feature.title}
                      </CardItem>
                      <CardItem as="p" translateZ={20} className="text-gray-700 text-lg">
                        {feature.description}
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                </BackgroundGradient>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section with Teal Accents */}
      <div className="py-20 px-6 md:px-10 lg:px-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-teal-600 font-medium mb-2">SIMPLE PROCESS</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 max-w-xl mx-auto">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto mt-6"></div>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <BackgroundGradient className="rounded-[22px] p-6 bg-white border border-gray-100">
                <div className="h-[400px] w-full rounded-lg bg-gradient-to-br from-gray-50 to-teal-100 flex items-center justify-center shadow-inner">
                  <span className="text-8xl">📊</span>
                </div>
              </BackgroundGradient>
            </div>
            <div className="md:w-1/2 space-y-8">
              {[
                {
                  step: 1,
                  title: "Upload Educational Content",
                  description: "Start by uploading your educational PDFs in either English or Sinhala."
                },
                {
                  step: 2,
                  title: "AI Generates Quizzes",
                  description: "Our RAG model analyzes content and creates quizzes with varying difficulty levels."
                },
                {
                  step: 3,
                  title: "Progress Through Levels",
                  description: "Begin at your comfort level and advance as you master the content."
                },
                {
                  step: 4,
                  title: "Receive Personalized Recommendations",
                  description: "Get custom question recommendations based on your performance and learning gaps."
                }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-6 group hover:translate-x-1 transition-transform">
                  <div className="bg-teal-100 rounded-full w-14 h-14 flex items-center justify-center text-teal-600 font-bold text-xl shrink-0 shadow-md group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-lg">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section with Orange Gradient */}
      <div className="py-24 px-6 md:px-10 lg:px-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00TTE0IDI0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNCIvPjwvZz48L2c+PC9zdmc+')] opacity-40"/>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90">Join thousands of students using our AI-powered quiz system to improve their learning outcomes.</p>
          <button className="px-10 py-4 rounded-full bg-white text-purple-700 font-medium hover:bg-purple-100 shadow-xl hover:shadow-2xl hover:translate-y-[-2px] transition-all text-lg">
            Get Started Today
          </button>
        </div>
      </div>


      {/* Testimonials Section with Green Accents */}
      <div className="py-20 px-6 md:px-10 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-emerald-600 font-medium mb-2">WHAT USERS SAY</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 max-w-xl mx-auto">
              Testimonials
            </h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This quiz system has completely changed how I study. The personalized recommendations are spot on!",
                author: "Sarah J.",
                role: "Medical Student",
                color: "emerald"
              },
              {
                quote: "Being able to use learning materials in Sinhala has made education so much more accessible for me.",
                author: "Anura P.",
                role: "Undergraduate",
                color: "amber"
              },
              {
                quote: "The way it adapts to my learning pace is incredible. I can see my progress improving each week.",
                author: "Michael T.",
                role: "High School Teacher",
                color: "rose"
              }
            ].map((testimonial, index) => (
              <div key={index} className={`bg-${testimonial.color}-50 p-8 rounded-2xl border border-${testimonial.color}-100 hover:shadow-xl transition-shadow`}>
                <div className={`text-${testimonial.color}-600 text-4xl mb-4`}>"</div>
                <p className={`text-gray-800 mb-6 italic`}>{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-${testimonial.color}-200 rounded-full flex items-center justify-center text-${testimonial.color}-600 font-bold`}>
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className={`text-${testimonial.color}-600 text-sm`}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with Deep Purple Instead of Blue */}
      <footer className="py-16 px-6 md:px-10 lg:px-20 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">RAG Quiz System</h3>
            <p className="text-gray-300 mb-6">The next generation of AI-powered learning that adapts to your needs.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <span>📱</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <span>💬</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center hover:bg-teal-500 transition-colors">
                <span>📧</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", link: "#" },
                { name: "Features", link: "#features" },
                { name: "Pricing", link: "#" },
                { name: "About Us", link: "#" },
                { name: "Contact", link: "#" }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.link} className="text-gray-300 hover:text-purple-300 transition-colors flex items-center">
                    <span className="mr-2">→</span> {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates and features.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400" 
              />
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} RAG Quiz System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}