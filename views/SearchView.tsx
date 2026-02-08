import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Sparkles, MapPin, BookOpen, Globe, ExternalLink, Loader2, X } from 'lucide-react';
import { ViewState } from '../types';
import { GRID_ITEMS, MOCK_TIMETABLE } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface SearchViewProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

interface SearchResult {
  id: string;
  type: 'MODULE' | 'PAGE' | 'AI_LINK' | 'STAFF';
  title: string;
  subtitle: string;
  target?: ViewState;
  url?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ onBack, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [localResults, setLocalResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLinks, setAiLinks] = useState<{title: string, uri: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle local filtering
  useEffect(() => {
    if (query.length < 2) {
      setLocalResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    const results: SearchResult[] = [];

    // Filter Grid Items
    GRID_ITEMS.forEach(item => {
      if (item.label.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `page-${item.id}`,
          type: 'PAGE',
          title: item.label,
          subtitle: 'In-app navigation',
          target: item.targetView
        });
      }
    });

    // Filter Timetable/Modules
    MOCK_TIMETABLE.forEach(session => {
      if (session.module.toLowerCase().includes(lowerQuery) || session.lecturer.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `module-${session.id}`,
          type: 'MODULE',
          title: session.module,
          subtitle: `${session.type} with ${session.lecturer}`,
          target: ViewState.TIMETABLE
        });
      }
    });

    setLocalResults(results);
  }, [query]);

  const handleAiSearch = async () => {
    if (!query.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);
    setAiLinks([]);

    try {
      // FIX: Initialize GoogleGenAI with process.env.API_KEY as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Find university information or campus locations for: ${query}. Focus on University of Leeds specific details if possible.`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are the Athena AI search engine for University of Leeds students. Provide concise answers with relevant campus links."
        }
      });

      // FIX: Using .text property to extract output.
      setAiResponse(response.text || "I found some information for you.");
      
      // Extract grounding links from groundingMetadata
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          title: c.web.title || "External Resource",
          uri: c.web.uri
        }));
      
      setAiLinks(links);

    } catch (err) {
      console.error("AI Search Error:", err);
      setAiResponse("I encountered an error searching for that. Try asking about local modules or campus features.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 animate-in fade-in duration-200">
      {/* Search Bar Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-50">
        <button onClick={onBack} className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            placeholder="Search modules, staff, campus..."
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl py-2.5 pl-10 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-leeds-blue dark:focus:ring-orange-500 transition-all"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {/* Suggestion AI Trigger */}
        {query && !isAiLoading && !aiResponse && (
          <button 
            onClick={handleAiSearch}
            className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-orange-950/20 rounded-2xl border border-blue-100 dark:border-orange-900/30 text-leeds-blue dark:text-orange-400 group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Search with Athena AI</p>
                <p className="text-xs opacity-70">Get answers from the web and campus maps</p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        {/* AI Results */}
        {isAiLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-leeds-blue dark:text-orange-500" />
            <p className="text-sm font-medium animate-pulse">Thinking about your query...</p>
          </div>
        )}

        {aiResponse && !isAiLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-3 text-leeds-blue dark:text-orange-500">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">AI Result</span>
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
              {aiResponse}
            </p>
            
            {aiLinks.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-gray-700">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Verified Sources</h4>
                <div className="grid grid-cols-1 gap-2">
                  {aiLinks.map((link, idx) => (
                    <a 
                      key={idx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400 group-hover:text-leeds-blue" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[240px]">{link.title}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-gray-300" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Local Search Results */}
        {localResults.length > 0 && (
          <div>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">In-App Results</h3>
            <div className="space-y-2">
              {localResults.map(result => (
                <button
                  key={result.id}
                  onClick={() => result.target && onNavigate(result.target)}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-leeds-blue/30 dark:hover:border-orange-500/30 shadow-sm active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${
                      result.type === 'MODULE' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 
                      'bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                    }`}>
                      {result.type === 'MODULE' ? <BookOpen className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{result.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Recents */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Start searching</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[240px] mt-2">
              Find anything about your modules, campus life, or university services.
            </p>
          </div>
        )}

        {query && localResults.length === 0 && !aiResponse && !isAiLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No local results for "{query}"</p>
            <p className="text-xs text-gray-400 mt-1">Try Athena AI search above</p>
          </div>
        )}
      </div>
    </div>
  );
};
