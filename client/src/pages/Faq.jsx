import { useState } from "react";

const faqs = [
  {
    question: "What is Match Trackers?",
    answer:
      "Match Trackers is an online sports media platform providing live scores, news, updates, and in-depth content for Cricket, Football, Tennis, F1, and more.",
  },
  {
    question: "Is Match Trackers free to use?",
    answer:
      "Yes! All our core content including live scores, articles, and updates are free for all users.",
  },
  {
    question: "Do you cover all sports?",
    answer:
      "We focus on the most popular sports globally including Cricket, Football, Tennis, and F1. We're constantly expanding coverage based on audience interest.",
  },
  {
    question: "How accurate are your live scores?",
    answer:
      "We use reliable data sources and real-time syncing. However, occasional delays may occur due to external factors beyond our control.",
  },
  {
    question: "Can I trust the sports news you publish?",
    answer:
      "Yes. Our editorial team ensures that all news and stories are fact-checked and sourced from verified outlets.",
  },
  {
    question: "Is there a Match Trackers mobile app?",
    answer:
      "Our mobile app is currently under development! Meanwhile, our website is fully responsive and works great on all devices.",
  },
  {
    question: "Can I contribute content or articles?",
    answer:
      "Absolutely. We welcome writers and contributors. Please reach out via our contact page to learn more.",
  },
  {
    question: "Do you have a fantasy league section?",
    answer:
      "We are working on adding a fantasy section where users can track player stats and play with friends. Stay tuned!",
  },
  {
    question: "How do I report a mistake or incorrect score?",
    answer:
      "Please use our 'Report an Issue' button or contact us via email. We’ll address it as soon as possible.",
  },
  {
    question: "Where can I find match highlights or videos?",
    answer:
      "We provide embedded highlight links from official broadcasting partners when available. Check the article or live score section of each match.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border  border-gray-200 rounded-xl transition-all shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 cursor-pointer py-4 flex justify-between items-center text-left"
            >
              <span className="text-lg font-medium">{faq.question}</span>
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </button>

            <div
              className={`px-6 overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 py-2" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
