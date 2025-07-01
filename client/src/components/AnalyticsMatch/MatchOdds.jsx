import React, { useState } from "react";
import { BsChevronDown } from "react-icons/bs";

export default function MatchOdds({ sofaData }) {
  const [showOdds, setShowOdds] = useState(2);

  // Check if odds data exists
  const hasOdds = sofaData?.markets && sofaData.markets.length > 0;

  return (
    <div className="w-full space-y-4">
      <div className=" order-1 lg:order-3">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
            <h2 className="text-xl font-bold">Match Odds</h2>
          </div>

          {hasOdds ? (
            <div className="space-y-4 p-4">
              {sofaData.markets.slice(0, showOdds).map((market) => (
                <div
                  key={market.id}
                  className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center border-b border-blue-200 pb-2 mb-3">
                    <p className="text-lg font-bold text-gray-800">
                      {market.marketName}
                    </p>
                    <img
                      className="h-5"
                      src="https://matchtrackers.com/assets/navLogo-CDr_GOtB.svg"
                      alt="Match Trackers logo"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {market.choices.map((choice) => (
                      <div
                        key={choice.sourceId}
                        className="flex flex-col items-center p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <p className="font-medium text-gray-700">
                          {choice.name}
                        </p>
                        <p className="text-lg font-bold text-blue-700 mt-1">
                          {choice.fractionalValue}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex text-sm mt-3 justify-between items-center">
                    <p className="font-semibold text-xs text-gray-600">
                      Gamble responsibly 18+
                    </p>
                  </div>
                </div>
              ))}

              {/* Only show this button if there are more than 2 markets */}
              {sofaData.markets.length > 2 && (
                <div className="w-full flex justify-center">
                  <button
                    onClick={() => {
                      if (showOdds === 2) setShowOdds(sofaData.markets.length);
                      else setShowOdds(2);
                    }}
                    className="cursor-pointer font-semibold"
                  >
                    {showOdds === sofaData.markets.length
                      ? "Show Less"
                      : "Show More"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 font-medium">
                We could not find the odds for this match.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Please check back later for updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
