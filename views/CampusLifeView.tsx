import React, { useState } from 'react';
import { ArrowLeft, MapPin, Coffee, Library, Landmark, Clock, Info, Search, Sparkles, ExternalLink, Navigation } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CampusLifeViewProps {
  onBack: () => void;
}

const LOCATIONS = [
  {
    id: 1,
    name: 'Parkinson Building',
    description: 'The iconic clock tower and entrance to the university.',
    fullDescription: 'Opened in 1951, the Parkinson Building is a Grade II listed art deco building that serves as a landmark for the university and the city of Leeds. It houses the Brotherton Library collection and the university art gallery.',
    image: 'https://images.unsplash.com/photo-1548842145-23c8a3233306?auto=format&fit=crop&q=80&w=800',
    icon: Landmark,
    tags: ['Landmark', 'Art Gallery', 'Cafe'],
    address: 'Woodhouse Lane, Leeds LS2 9JT',
    openingHours: '08:00 - 20:00',
    facilities: ['Treasures Gallery', 'Stanley & Audrey Burton Gallery', 'Parkinson Court Cafe']
  },
  {
    id: 2,
    name: 'Leeds University Union',
    description: 'The heart of student life with clubs, shops, and bars.',
    fullDescription: 'LUU is a charity that supports over 38,000 students. It was the first students\' union in the UK to be awarded "Excellent" status by the NUS.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    icon: Coffee,
    tags: ['Social', 'Shops', 'Events'],
    address: 'Lifton Place, Leeds LS2 9JZ',
    openingHours: '08:00 - Late',
    facilities: ['Old Bar', 'Terrace', 'Co-op', 'Common Ground', 'Riley Smith Theatre']
  },
  {
    id: 3,
    name: 'Edward Boyle Library',
    description: 'Modern library with extensive study spaces.',
    fullDescription: 'Recently refurbished, "Eddy B" offers over 2,000 study spaces, research hubs, and a dedicated postgraduate level. It is one of the busiest libraries on campus.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    icon: Library,
    tags: ['Study', 'Quiet', 'Resources'],
    address: 'University of Leeds, Leeds LS2 9JT',
    openingHours: '24/7 (Term Time)',
    facilities: ['Group Study Rooms', 'Postgraduate Roof Garden', 'Cafe', 'IT Clusters']
  },
  {
    id: 4,
    name: 'Roger Stevens',
    description: 'Brutalist building housing 25 lecture theatres.',
    fullDescription: 'A Grade II* listed building known for its unique brutalist architecture. It is the primary teaching building for many faculties and features a complex layout of tiered lecture theatres.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    icon: MapPin,
    tags: ['Lectures', 'Coffee Bar', 'Pond'],
    address: 'University of Leeds, Willow Terrace Road',
    openingHours: '08:00 - 18:00',
    facilities: ['Lecture Theatres', 'Sustainable Garden', 'Coffee Bar', 'Vending Machines']
  }
];

export const CampusLifeView: React.FC<CampusLifeViewProps> = ({ onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATIONS[0] | null>(null);
  
  // AI Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [foundPlaces, setFoundPlaces] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setAiResponse(null);
    setFoundPlaces([]);

    try {
        // FIX: Using process.env.API_KEY directly for initialization as per guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Find places on or near the University of Leeds campus related to: ${searchQuery}. Prioritize university buildings if relevant.`,
            config: {
                tools: [{ googleMaps: {} }],
            }
        });

        // FIX: Extracting text using the .text property (not a method).
        setAiResponse(response.text || "I found some places for you.");

        // Extract Grounding Chunks (Maps Data)
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const places = chunks
            .map((chunk: any) => chunk.maps)
            .filter((mapData: any) => mapData && mapData.title);
        
        setFoundPlaces(places);

    } catch (error) {
        console.error("Search Error", error);
        setAiResponse("Sorry, I couldn't connect to the campus map service right now.");
    } finally {
        setIsSearching(false);
    }
  };

  // Detail View
  if (selectedLocation) {
      return (
        <div className="flex flex-col min-h-full bg-white dark:bg-gray-900 animate-in slide-in-from-right duration-300 pb-24">
            <div className="relative h-72 w-full shrink-0">
                <img src={selectedLocation.image} alt={selectedLocation.name} className="w-full h-full object-cover" />
                <button 
                    onClick={() => setSelectedLocation(null)}
                    className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-all z-10"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-24">
                     <h2 className="text-3xl font-bold text-white mb-2">{selectedLocation.name}</h2>
                     <div className="flex flex-wrap gap-2">
                         {selectedLocation.tags.map(tag => (
                             <span key={tag} className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white rounded text-xs font-medium">
                                 {tag}
                             </span>
                         ))}
                     </div>
                </div>
            </div>
            
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Info className="w-5 h-5 text-leeds-blue dark:text-orange-500" />
                        About
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                        {selectedLocation.fullDescription}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                        <MapPin className="text-gray-400 w-5 h-5 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Address</p>
                            <p className="text-gray-900 dark:text-white font-medium">{selectedLocation.address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="text-gray-400 w-5 h-5 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Opening Hours</p>
                            <p className="text-gray-900 dark:text-white font-medium">{selectedLocation.openingHours}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Key Facilities</h3>
                    <ul className="grid grid-cols-2 gap-3">
                         {selectedLocation.facilities.map((f, i) => (
                             <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                 <div className="w-2 h-2 rounded-full bg-leeds-green shrink-0" />
                                 <span className="text-sm font-medium">{f}</span>
                             </li>
                         ))}
                    </ul>
                </div>
            </div>
        </div>
      );
  }

  // List View
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-40">
         <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-1">
                <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campus Guide</h2>
         </div>
         
         {/* AI Search Bar */}
         <div className="relative">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                 {isSearching ? (
                     <div className="w-4 h-4 border-2 border-leeds-blue dark:border-orange-500 border-t-transparent rounded-full animate-spin" />
                 ) : (
                     <Sparkles className="w-4 h-4 text-leeds-blue dark:text-orange-500" />
                 )}
             </div>
             <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                 placeholder="Find coffee, libraries, labs..."
                 className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl py-3 pl-10 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-leeds-blue dark:focus:ring-orange-500 transition-all"
             />
             <button 
                 onClick={handleSearch}
                 disabled={!searchQuery.trim() || isSearching}
                 className="absolute right-2 top-1.5 p-1.5 bg-white dark:bg-gray-600 rounded-lg text-gray-500 dark:text-gray-300 hover:text-leeds-blue dark:hover:text-orange-500 disabled:opacity-50"
             >
                 <Search className="w-4 h-4" />
             </button>
         </div>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        
        {/* AI Results Section */}
        {(aiResponse || foundPlaces.length > 0) && (
             <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                 {aiResponse && (
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-100 dark:border-orange-900/30 shadow-sm">
                         <div className="flex items-center gap-2 mb-2 text-leeds-blue dark:text-orange-500 font-bold text-sm uppercase tracking-wide">
                             <Sparkles className="w-4 h-4" />
                             <span>AI Assistant</span>
                         </div>
                         <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                             {aiResponse}
                         </p>
                     </div>
                 )}

                 {foundPlaces.length > 0 && (
                     <div>
                         <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 ml-1">Found Locations</h3>
                         <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                             {foundPlaces.map((place, idx) => (
                                 <a 
                                     key={idx}
                                     href={place.source?.uri}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
                                 >
                                     <div className="flex justify-between items-start mb-2">
                                         <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                                             <MapPin className="w-5 h-5" />
                                         </div>
                                         <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-leeds-blue dark:group-hover:text-orange-500 transition-colors" />
                                     </div>
                                     <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{place.title}</h4>
                                     <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                         {place.placeAnswerSources?.reviewSnippets?.[0]?.snippet || "View details on Google Maps"}
                                     </p>
                                     <div className="flex items-center text-xs font-medium text-leeds-blue dark:text-orange-500">
                                         <Navigation className="w-3 h-3 mr-1" />
                                         Get Directions
                                     </div>
                                 </a>
                             ))}
                         </div>
                     </div>
                 )}
             </div>
        )}

        {/* Featured Static List */}
        <div>
            <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Featured Spaces</h3>
                 <span className="text-xs font-medium text-gray-400">Selected for you</span>
            </div>

            <div className="space-y-4">
                {LOCATIONS.map((loc) => (
                    <button 
                        key={loc.id} 
                        onClick={() => setSelectedLocation(loc)}
                        className="w-full text-left bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.99] group"
                    >
                        <div className="h-48 w-full overflow-hidden relative">
                            <img 
                                src={loc.image} 
                                alt={loc.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-sm text-leeds-blue dark:text-orange-500">
                                <loc.icon className="w-5 h-5" />
                            </div>
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                {loc.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-black/60 backdrop-blur-md text-white rounded text-[10px] font-bold uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{loc.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {loc.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
