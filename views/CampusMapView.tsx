import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Sparkles, Navigation, ExternalLink, Loader2, Compass, Map as MapIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CampusMapViewProps {
  onBack: () => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [groundingResults, setGroundingResults] = useState<any[]>([]);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation error:", err)
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setAiResponse(null);
    setGroundingResults([]);

    try {
      // FIX: Obtaining API key exclusively from process.env.API_KEY.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find university locations, buildings, or services at the University of Leeds related to: ${query}. Use grounding to provide accurate URLs and addresses.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: location ? {
            retrievalConfig: {
              latLng: {
                latitude: location.lat,
                longitude: location.lng
              }
            }
          } : undefined
        },
      });

      // FIX: Accessing response text using the .text property.
      setAiResponse(response.text || "I've found some locations for you.");
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const places = chunks
        .map((chunk: any) => chunk.maps)
        .filter((mapData: any) => mapData && mapData.title);
      
      setGroundingResults(places);

    } catch (error) {
      console.error("Maps Search Error:", error);
      setAiResponse("I couldn't reach the campus mapping service. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <MapIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campus Map</h2>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {isSearching ? <Loader2 className="w-4 h-4 text-leeds-blue animate-spin" /> : <Search className="w-4 h-4 text-gray-400" />}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for buildings, cafes, labs..."
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-leeds-blue dark:focus:ring-orange-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Empty State */}
        {!aiResponse && !isSearching && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Compass className="w-10 h-10 text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Locate Campus Spaces</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-2">
              Search for specific buildings (e.g. "EC Stoner"), study spots, or the nearest coffee shop.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
                {['EC Stoner', 'Laidlaw Library', 'Old Bar', 'Ziff Building'].map(suggestion => (
                    <button 
                        key={suggestion}
                        onClick={() => { setQuery(suggestion); setTimeout(handleSearch, 100); }}
                        className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-leeds-blue/30 transition-all"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
          </div>
        )}

        {/* AI Answer Card */}
        {aiResponse && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm animate-in slide-in-from-top-4">
            <div className="flex items-center gap-2 mb-3 text-leeds-blue dark:text-orange-500">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Map Assistant</span>
            </div>
            <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed prose dark:prose-invert">
                {aiResponse}
            </div>
          </div>
        )}

        {/* Grounded Locations */}
        {groundingResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Verified Locations
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {groundingResults.map((place, idx) => (
                <div 
                    key={idx}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm group"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-leeds-blue dark:group-hover:text-orange-500 transition-colors">
                                {place.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {place.placeAnswerSources?.reviewSnippets?.[0]?.snippet || "University of Leeds Campus"}
                            </p>
                        </div>
                        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-xl text-red-600 dark:text-red-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-50 dark:border-gray-700">
                        <a 
                            href={place.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 active:scale-95 transition-all"
                        >
                            <Navigation className="w-3.5 h-3.5" />
                            Directions
                        </a>
                        <a 
                            href={place.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-leeds-blue dark:bg-orange-600 text-white rounded-xl active:scale-95 transition-all"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
